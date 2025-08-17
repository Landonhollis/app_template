/*
 * STRIPE SUBSCRIPTION WEBHOOKS HANDLER
 * ===================================
 * 
 * This file handles all Stripe webhook events related to subscriptions.
 * When Stripe processes subscription changes, it sends webhook events to this endpoint
 * to keep your database synchronized with Stripe's records.
 * 
 * WEBHOOK EVENTS HANDLED:
 * 
 * 1. checkout.session.completed
 *    - WHEN: Customer completes a new subscription checkout
 *    - DATA AVAILABLE: 
 *      * event.data.object.customer (Stripe customer ID)
 *      * event.data.object.subscription (Stripe subscription ID) 
 *      * event.data.object.metadata (custom data you passed)
 *    - ACTION: Update database with new subscription status
 * 
 * 2. customer.subscription.created
 *    - WHEN: New subscription is created (after payment collection)
 *    - DATA AVAILABLE:
 *      * event.data.object.id (subscription ID)
 *      * event.data.object.customer (customer ID)
 *      * event.data.object.status ('active', 'trialing', etc.)
 *      * event.data.object.items.data[0].price.id (price ID of the plan)
 *      * event.data.object.current_period_start/end (billing period)
 *    - ACTION: Create subscription record in your database
 * 
 * 3. customer.subscription.updated
 *    - WHEN: Subscription is modified (plan change, quantity change, etc.)
 *    - DATA AVAILABLE:
 *      * event.data.object.id (subscription ID)
 *      * event.data.object.status (new status)
 *      * event.data.object.items.data[0].price.id (new price ID)
 *      * event.data.previous_attributes (what changed)
 *    - ACTION: Update subscription details in your database
 * 
 * 4. customer.subscription.deleted
 *    - WHEN: Subscription is canceled/deleted
 *    - DATA AVAILABLE:
 *      * event.data.object.id (subscription ID)
 *      * event.data.object.customer (customer ID)
 *      * event.data.object.canceled_at (cancellation timestamp)
 *    - ACTION: Mark subscription as canceled in your database
 * 
 * 5. invoice.payment_succeeded
 *    - WHEN: Recurring payment succeeds (monthly/yearly billing)
 *    - DATA AVAILABLE:
 *      * event.data.object.customer (customer ID)
 *      * event.data.object.subscription (subscription ID)
 *      * event.data.object.amount_paid (amount in cents)
 *      * event.data.object.status ('paid')
 *    - ACTION: Log successful payment, extend subscription period
 * 
 * 6. invoice.payment_failed
 *    - WHEN: Recurring payment fails (card declined, expired, etc.)
 *    - DATA AVAILABLE:
 *      * event.data.object.customer (customer ID)
 *      * event.data.object.subscription (subscription ID)
 *      * event.data.object.attempt_count (how many retry attempts)
 *      * event.data.object.next_payment_attempt (when next retry)
 *    - ACTION: Notify customer, potentially suspend service after multiple failures
 */

const { createClient } = require('@supabase/supabase-js');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Helper function to get subscription plan name from Stripe price ID
function getPlanFromPriceId(priceId: string): string {
  const priceToPlans: Record<string, string> = {
    [process.env.STRIPE_PRICE_BASIC_MONTHLY || '']: 'basic_monthly',
    [process.env.STRIPE_PRICE_BASIC_YEARLY || '']: 'basic_yearly',
    [process.env.STRIPE_PRICE_PRO_MONTHLY || '']: 'pro_monthly',
    [process.env.STRIPE_PRICE_PRO_YEARLY || '']: 'pro_yearly',
  };
  
  return priceToPlans[priceId] || 'unknown';
}

// Helper function to update user subscription in database
async function updateUserSubscription(customerId: string, subscriptionData: any) {
  try {
    const { error } = await supabase
      .from('accounts')
      .update(subscriptionData)
      .eq('customer_id', customerId);
      
    if (error) {
      console.error('Database update error:', error);
      throw error;
    }
    
    console.log('✅ Database updated successfully for customer:', customerId);
  } catch (error) {
    console.error('❌ Failed to update database:', error);
    throw error;
  }
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // In production, verify webhook signature here:
    // const sig = req.headers['stripe-signature'];
    // const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    
    // For now, just parse the event (REMOVE THIS IN PRODUCTION)
    const event = req.body;
    
    console.log(`🔔 Webhook received: ${event.type}`);
    console.log(`📋 Event ID: ${event.id}`);
    
    switch (event.type) {
      
      case 'checkout.session.completed':
        console.log('💳 Checkout session completed');
        const session = event.data.object;
        
        if (session.mode === 'subscription') {
          console.log(`👤 Customer: ${session.customer}`);
          console.log(`📦 Subscription: ${session.subscription}`);
          
          // IMPORTANT: Only store customer_id and platform_subscription_id
          // DON'T update subscription plan yet - wait for invoice.payment_succeeded
          await updateUserSubscription(session.customer, {
            customer_id: session.customer,
            platform_subscription_id: session.subscription
            // subscription field stays unchanged until payment succeeds
          });
        }
        break;
        
      case 'customer.subscription.created':
        console.log('🆕 New subscription created');
        const newSub = event.data.object;
        const newPlan = getPlanFromPriceId(newSub.items.data[0].price.id);
        
        console.log(`👤 Customer: ${newSub.customer}`);
        console.log(`📦 Subscription: ${newSub.id}`);
        console.log(`💰 Plan: ${newPlan}`);
        console.log(`📊 Status: ${newSub.status}`);
        
        // IMPORTANT: Only store IDs, DON'T update subscription plan yet
        // Wait for invoice.payment_succeeded to confirm payment
        await updateUserSubscription(newSub.customer, {
          customer_id: newSub.customer,
          platform_subscription_id: newSub.id
          // subscription field stays unchanged until payment succeeds
        });
        break;
        
      case 'customer.subscription.updated':
        console.log('🔄 Subscription updated');
        const updatedSub = event.data.object;
        const updatedPlan = getPlanFromPriceId(updatedSub.items.data[0].price.id);
        
        console.log(`👤 Customer: ${updatedSub.customer}`);
        console.log(`📦 Subscription: ${updatedSub.id}`);
        console.log(`📊 Status: ${updatedSub.status}`);
        console.log(`💰 Plan: ${updatedPlan}`);
        
        if (updatedSub.status === 'canceled') {
          console.log('❌ Subscription canceled - setting to free');
          await updateUserSubscription(updatedSub.customer, {
            subscription: 'free'
          });
        } else if (updatedSub.status === 'active') {
          // For active subscriptions, check if this is a plan change
          // This handles downgrades and plan changes that don't require immediate payment
          console.log('✅ Active subscription - updating plan to:', updatedPlan);
          await updateUserSubscription(updatedSub.customer, {
            subscription: updatedPlan
          });
        } else {
          console.log('ℹ️ Subscription updated, status:', updatedSub.status, '- waiting for activation');
        }
        break;
        
      case 'customer.subscription.deleted':
        console.log('🗑️ Subscription deleted');
        const canceledSub = event.data.object;
        
        console.log(`👤 Customer: ${canceledSub.customer}`);
        console.log(`📦 Subscription: ${canceledSub.id}`);
        console.log(`❌ Deleted at: ${new Date(canceledSub.canceled_at * 1000).toISOString()}`);
        
        // Set to free but KEEP customer_id and platform_subscription_id for reactivation
        await updateUserSubscription(canceledSub.customer, {
          subscription: 'free'
          // Keep customer_id and platform_subscription_id for potential reactivation
        });
        break;
        
      case 'invoice.payment_succeeded':
        console.log('✅ Payment succeeded - THIS IS WHERE WE UPDATE SUBSCRIPTION PLAN');
        const paidInvoice = event.data.object;
        
        console.log(`👤 Customer: ${paidInvoice.customer}`);
        console.log(`📦 Subscription: ${paidInvoice.subscription}`);
        console.log(`💰 Amount: $${paidInvoice.amount_paid / 100}`);
        
        // ONLY update subscription plan when payment actually succeeds
        if (paidInvoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(paidInvoice.subscription);
          const plan = getPlanFromPriceId(subscription.items.data[0].price.id);
          
          console.log(`🎉 Payment confirmed - updating to plan: ${plan}`);
          
          await updateUserSubscription(paidInvoice.customer, {
            subscription: plan
            // customer_id and platform_subscription_id already set from earlier events
          });
        }
        break;
        
      case 'invoice.payment_failed':
        console.log('❌ Payment failed - NO DATABASE CHANGES');
        const failedInvoice = event.data.object;
        
        console.log(`👤 Customer: ${failedInvoice.customer}`);
        console.log(`📦 Subscription: ${failedInvoice.subscription}`);
        console.log(`🔄 Attempt: ${failedInvoice.attempt_count}`);
        
        // IMPORTANT: Do NOT update subscription field
        // User keeps their current plan until payment succeeds
        // Stripe will automatically handle retries and eventual cancellation
        
        if (failedInvoice.attempt_count >= 3) {
          console.log('⚠️ Multiple payment failures - subscription may be canceled soon');
          // You might want to send notification emails here
        }
        
        console.log('ℹ️ User keeps current subscription until payment succeeds or subscription is canceled');
        break;
        
      default:
        console.log(`🤷 Unhandled event type: ${event.type}`);
    }
    
    // Always respond with 200 to acknowledge receipt
    res.status(200).json({ 
      received: true,
      eventType: event.type,
      processed: true
    });
    
  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).json({ 
      error: 'Webhook processing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}