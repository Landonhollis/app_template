// Required imports and setup
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { getUserFromDatabase } = require('./fetchSupaBase');

// Initialize Express app (if not already initialized elsewhere)
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Bypasses RLS
);

// Main endpoint handler
app.post('/apiPlatformSubscription', async (req: any, res: any) => {
  try {
    const { newSubscription, userId } = req.body;
    
    // Validate input
    if (!newSubscription || !userId) {
      return res.status(400).json({ 
        error: 'Missing required fields: newSubscription and userId' 
      });
    }

    // Validate subscription type
    const validSubscriptions = ['free', 'basic_monthly', 'basic_yearly', 'pro_monthly', 'pro_yearly'];
    if (!validSubscriptions.includes(newSubscription)) {
      return res.status(400).json({ 
        error: 'Invalid subscription plan. Must be one of: free, basic_monthly, basic_yearly, pro_monthly, pro_yearly' 
      });
    }
    
    // Get user from database
    const user = await getUserFromDatabase(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if user is requesting the plan they're already on
    const currentSubscription = user?.subscription;
    if (currentSubscription === newSubscription) {
      return res.status(400).json({ 
        error: 'You are already subscribed to this plan.' 
      });
    }
    
    // Get or create Stripe customer ID
    let customerId = user?.customer_id;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        metadata: {
          userId: userId
        }
      });
      customerId = customer.id;
      
      // Update user with new customer ID
      const { error: updateError } = await supabase
        .from('accounts')
        .update({ customer_id: customerId })
        .eq('user_id', userId);
          
      if (updateError) {
        console.error('Error updating customer_id:', updateError);
        return res.status(500).json({ 
          error: 'Failed to update customer information' 
        });
      }
    }
    
    const platformSubscriptionId = user?.platform_subscription_id;
    
    if (platformSubscriptionId) {
      // User has existing subscription - update it
      
      // Check if newSubscription is 'free' - just set plan to inactive
      if (newSubscription === 'free') {
          // Cancel/set subscription to inactive
          const canceledSubscription = await stripe.subscriptions.update(
            platformSubscriptionId,
            {
                cancel_at_period_end: true
            }
          );
          
          // Update subscription in database
          const { error: dbUpdateError } = await supabase
            .from('accounts')
            .update({ subscription: 'free' })
            .eq('user_id', userId);
              
          if (dbUpdateError) {
            console.error('Error updating subscription in database:', dbUpdateError);
            return res.status(500).json({ 
              error: 'Failed to update subscription in database' 
            });
          }
          
        res.json({ 
          success: true, 
          changedSubscription: true,
          message: 'Subscription set to cancel at period end'
        });
        return;
      }
      
      const priceId = getPriceIdFromPlan(newSubscription);
      
      if (!priceId) {
        return res.status(400).json({ 
          error: 'Invalid subscription plan' 
        });
      }
      
      // Retrieve current subscription
      const currentStripeSubscription = await stripe.subscriptions.retrieve(
        platformSubscriptionId
      );
      
      // Get the subscription item ID
      const subscriptionItemId = currentStripeSubscription.items.data[0].id;
      
      // Update the subscription
      const updatedSubscription = await stripe.subscriptions.update(
        platformSubscriptionId, 
        {
          items: [{
            id: subscriptionItemId,
            price: priceId,
          }],
          proration_behavior: 'always_invoice',
        }
      );
      
      // Update subscription in database
      const { error: dbUpdateError } = await supabase
        .from('accounts')
        .update({ subscription: newSubscription })
        .eq('user_id', userId);
          
      if (dbUpdateError) {
        console.error('Error updating subscription in database:', dbUpdateError);
        return res.status(500).json({ 
            error: 'Failed to update subscription in database' 
        });
      }
      
      res.json({ 
        success: true, 
        changedSubscription: true,
        message: 'Subscription updated successfully'
      });
        
    } else {
      // User doesn't have a subscription - create new one
      
      // Handle 'free' subscription case
      if (newSubscription === 'free') {
        // For free subscription, just update the database
        const { error: dbUpdateError } = await supabase
          .from('accounts')
          .update({ subscription: 'free' })
          .eq('user_id', userId);
            
        if (dbUpdateError) {
          console.error('Error updating subscription in database:', dbUpdateError);
          return res.status(500).json({ 
            error: 'Failed to update subscription in database' 
          });
        }
        
        res.json({ 
          success: true, 
          message: 'Free subscription activated'
        });
        return;
      }
      
      const priceId = getPriceIdFromPlan(newSubscription);
      
      if (!priceId) {
        return res.status(400).json({ 
          error: 'Invalid subscription plan' 
        });
      }
      
      // Create ephemeral key for mobile clients
      const ephemeralKey = await stripe.ephemeralKeys.create(
        { customer: customerId },
        { apiVersion: '2024-06-20' }
      );
      
      // Create a subscription with payment intent (recommended)
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: { 
          save_default_payment_method: 'on_subscription' 
        },
        expand: ['latest_invoice.payment_intent']
      });
      
      // Save the platformSubscriptionId to supabase
      const { error: saveSubIdError } = await supabase
        .from('accounts')
        .update({ platform_subscription_id: subscription.id })
        .eq('user_id', userId);
          
      if (saveSubIdError) {
        console.error('Error saving platform_subscription_id:', saveSubIdError);
        // Don't return error here as the subscription was created successfully
        // The user can still complete payment, but we should log this issue
      }
      
      const paymentIntent = subscription.latest_invoice.payment_intent;
      
      res.json({
        clientSecret: paymentIntent.client_secret,
        customerId: customerId,
        ephemeralKey: ephemeralKey.secret,
        subscriptionId: subscription.id
      });
    }
      
  } catch (error) {
    console.error('Error in changePlatformSubscription:', error);
    res.status(500).json({ 
      error: 'An error occurred while processing your subscription change',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Helper function to map plan names to Stripe price IDs
function getPriceIdFromPlan(plan: string): string | undefined {
  const priceMap: Record<string, string> = {
    'basic_monthly': process.env.STRIPE_PRICE_BASIC_MONTHLY || 'price_basic_monthly',
    'basic_yearly': process.env.STRIPE_PRICE_BASIC_YEARLY || 'price_basic_yearly',
    'pro_monthly': process.env.STRIPE_PRICE_PRO_MONTHLY || 'price_pro_monthly',
    'pro_yearly': process.env.STRIPE_PRICE_PRO_YEARLY || 'price_pro_yearly',
  };
  
  return priceMap[plan.toLowerCase()];
}

// Export app if this is a module
module.exports = app;

// Or start server if this is the main file
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });