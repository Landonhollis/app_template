import { View, Text, Pressable } from 'react-native'
import { useAccount } from '../../account/accountProvider'
import React, { useState, useEffect } from 'react'
import { useStripe } from '@stripe/stripe-react-native';



export default function SubscriptionScreen() {
  const { ps, email, subscription, loadAccountData } = useAccount()
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  


  const subscribeToBasic = async () => {
    setLoading(true);
    
    // 1. Fetch payment data from your backend
    const response = await fetch('YOUR_BACKEND_URL/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 1000 }) // $10.00 for basic
    });
    
    const { clientSecret, customerId, ephemeralKey } = await response.json();

    // 2. Initialize payment sheet
    const { error } = await initPaymentSheet({
      merchantDisplayName: 'Template App',
      paymentIntentClientSecret: clientSecret,
      customerId: customerId,
      customerEphemeralKeySecret: ephemeralKey,
    });

    if (error) {
      alert('Setup failed');
      setLoading(false);
      return;
    }

    // 3. Present payment sheet
    const { error: paymentError } = await presentPaymentSheet();
    
    if (paymentError) {
      alert(`Payment failed: ${paymentError.message}`);
    } else {
      alert('Payment successful!');
    }
    await loadAccountData();
    setLoading(false);
  };


  return (
    <View className="flex-1 items-center justify-center p-12" style={ps('bg-1')}>
      <Text style={ps('text-2xl fw-700 f-1 text-strong')}>Welcome to the Subscriptions Screen!</Text>

      <Text className="mt-14" style={ps('text-md f-1 text-normal')}>Current Subscription Plan: {subscription}</Text>

      <Pressable>
        <Text className="mt-14" style={ps('text-md f-1 text-normal')} onPress={subscribeToBasic}>Subscribe to basic</Text>
      </Pressable>
    </View>
  )
}