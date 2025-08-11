import { View, Text, Pressable } from 'react-native'
import { useAccount } from '../../account/accountProvider'
import React, { useState } from 'react'
import { useStripe } from '@stripe/stripe-react-native';
import { changeSubscription } from '../../callers/platformSubscription';
import { Alert } from 'react-native';



export default function SubscriptionScreen() {
  const { ps, email, subscription, loadAccountData, userId } = useAccount()
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  
  const handleSelectPlan = async (plan: string) => {
    setLoading(true);
    
    try {
      // Step 1: Call your backend
      if (!userId) {
        Alert.alert('Error', 'User ID not found');
        return;
      }
      const result = await changeSubscription(plan, userId);
      
      if (result.subscriptionChanged) {
        // Existing subscription updated (no payment needed)
        Alert.alert('Success', 'Plan upgraded successfully!');
        await loadAccountData(); // Refresh account data
        return;
      }
      
      if (result.clientSecret) {
        // Step 2: Initialize payment sheet
        const { error: initError } = await initPaymentSheet({
          merchantDisplayName: 'Your App Name',
          customerId: result.customerId,
          customerEphemeralKeySecret: result.ephemeralKey,
          paymentIntentClientSecret: result.clientSecret,
          defaultBillingDetails: {
            email: email || undefined,
          },
          returnURL: 'apptemplate://',
        });
        
        if (initError) {
          Alert.alert('Error', initError.message);
          return;
        }
        
        // Step 3: Present payment sheet
        const { error: presentError } = await presentPaymentSheet();
        
        if (presentError) {
          Alert.alert('Cancelled', presentError.message);
        } else {
          // Step 4: Payment successful!
          await loadAccountData(); // Refresh account data
          Alert.alert('Success', 'Subscription activated!');
        }
      }
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };


  


  return (
    <View className="flex-1 items-center justify-center p-12" style={ps('bg-1')}>
      <Text style={ps('text-2xl fw-700 f-1 text-strong')}>Welcome to the Subscriptions Screen!</Text>

      <Text className="mt-14" style={ps('text-md f-1 text-normal')}>Current Subscription Plan: {subscription}</Text>

      { subscription !== 'free' && (
        <Pressable disabled={loading}>
        <Text className="mt-14 p-4" style={ps('text-md f-1 text-normal bw-1 bc-strong br-4')} onPress={() => handleSelectPlan('free')}>{loading ? 'Processing...' : 'Switch to free plan'}</Text>
      </Pressable>
      )}

      { subscription !== 'basic_monthly' && (
      <Pressable disabled={loading}>
        <Text className="mt-4 p-4" style={ps('text-md f-1 text-normal bw-1 bc-strong br-4')} onPress={() => handleSelectPlan('basic_monthly')}>{loading ? 'Processing...' : 'Subscribe to Basic Monthly Plan'}</Text>
      </Pressable>
      )}

      { subscription !== 'basic_yearly' && (
      <Pressable disabled={loading}>
        <Text className="mt-4 p-4" style={ps('text-md f-1 text-normal bw-1 bc-strong br-4')} onPress={() => handleSelectPlan('basic_yearly')}>{loading ? 'Processing...' : 'Subscribe to Basic Yearly Plan'}</Text>
      </Pressable>
      )}

      { subscription !== 'pro_monthly' && (
      <Pressable disabled={loading}>
        <Text className="mt-4 p-4" style={ps('text-md f-1 text-normal bw-1 bc-strong br-4')} onPress={() => handleSelectPlan('pro_monthly')}>{loading ? 'Processing...' : 'Subscribe to Pro Monthly Plan'}</Text>
      </Pressable>
      )}

      { subscription !== 'pro_yearly' && (
      <Pressable disabled={loading}>
        <Text className="mt-4 p-4" style={ps('text-md f-1 text-normal bw-1 bc-strong br-4')} onPress={() => handleSelectPlan('pro_yearly')}>{loading ? 'Processing...' : 'Subscribe to Pro Yearly Plan'}</Text>
      </Pressable>
      )}
    </View>
  )
}