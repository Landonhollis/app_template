

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY  // Bypasses RLS
);

STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;




app.post('/create-payment-intent', async (req, res) => {
  const { amount, userId } = req.body;

  
  // Get user's Stripe customer ID
  let customerId = null;
  
  const currentId = await supabase
  .from('accounts')
  .select('customer_id')
  .eq('user_id', userId)
  .single();
    

  // Create if doesn't exist
  if (currentId) {
    customerId = currentId
  } else {
    const customer = await stripe.customers.create();
    customerId = customer.id;
    
    await supabase
    .from('accounts')
    .update({ customer_id: customerId })
    .eq('user_id', userId);
  }

  


  // Create ephemeral key for mobile
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customerId },
    { apiVersion: '2024-06-20' }
  );

  // Create payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount, // Amount in cents
    currency: 'usd',
    customer: customerId,
  });

  res.json({
    clientSecret: paymentIntent.client_secret,
    customerId: customerId,
    ephemeralKey: ephemeralKey.secret,
  });
});