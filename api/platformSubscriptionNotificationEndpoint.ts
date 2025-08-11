// api/platformSubscriptionNotificationEndpoint.js
// Simple webhook logger to see what Stripe is sending

const express = require('express');

// Initialize Express app
const app = express();
app.use(express.json()); // Parse incoming JSON

// This replaces `export default async function handler`
app.post('/platformSubscriptionNotificationsEndpoint', async (req: any, res: any) => {
  console.log('========================================');
  console.log('🔔 WEBHOOK RECEIVED!');
  console.log('========================================');
  
  // Log basic request info
  console.log('📍 Method:', req.method);
  console.log('📍 URL:', req.url);
  console.log('📍 Time:', new Date().toISOString());
  
  // Log all headers
  console.log('\n📋 HEADERS:');
  console.log(JSON.stringify(req.headers, null, 2));
  
  // Log the Stripe signature (important for verification later)
  console.log('\n🔐 Stripe Signature:', req.headers['stripe-signature'] || 'NOT FOUND');
  
  // Log the entire body
  console.log('\n📦 BODY:');
  console.log(JSON.stringify(req.body, null, 2));
  
  // If it's a Stripe event, log specific details
  if (req.body && req.body.type) {
    console.log('\n✨ EVENT DETAILS:');
    console.log('  Event Type:', req.body.type);
    console.log('  Event ID:', req.body.id);
    
    if (req.body.data && req.body.data.object) {
      console.log('  Object Type:', req.body.data.object.object);
      console.log('  Object ID:', req.body.data.object.id);
      
      // For subscription events, log key details
      if (req.body.data.object.object === 'subscription') {
        console.log('\n📊 SUBSCRIPTION INFO:');
        console.log('  Customer:', req.body.data.object.customer);
        console.log('  Status:', req.body.data.object.status);
        console.log('  Current Period End:', new Date(req.body.data.object.current_period_end * 1000).toISOString());
        
        if (req.body.data.object.items && req.body.data.object.items.data[0]) {
          console.log('  Price ID:', req.body.data.object.items.data[0].price.id);
          console.log('  Product ID:', req.body.data.object.items.data[0].price.product);
        }
      }
      
      // For payment events, log payment info
      if (req.body.data.object.object === 'invoice') {
        console.log('\n💳 INVOICE INFO:');
        console.log('  Customer:', req.body.data.object.customer);
        console.log('  Amount Paid:', req.body.data.object.amount_paid / 100, req.body.data.object.currency.toUpperCase());
        console.log('  Status:', req.body.data.object.status);
      }
    }
  }
  
  console.log('\n========================================');
  console.log('✅ WEBHOOK LOGGED SUCCESSFULLY');
  console.log('========================================\n');
  
  // Always return 200 to acknowledge receipt
  // Stripe will retry if you don't return 200
  res.status(200).json({ 
    received: true,
    message: 'Webhook logged successfully',
    eventType: req.body?.type || 'unknown'
  });
});