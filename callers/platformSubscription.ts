
// callers/subscription.ts
export const changeSubscription = async (
  newPlan: string,
  userId: string
) => {
  try {
    const response = await fetch('https://app-template-nu.vercel.app/api/apiPlatformSubscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        newSubscription: newPlan,
        userId 
      })
    });
    
    const data = await response.json();
    
    // For existing customer upgrading or free plan
    if (data.changedSubscription || (data.success && !data.clientSecret)) {
      return { 
        subscriptionChanged: true, 
        subscription: data.changedSubscription,
        message: data.message
      };
    }
    
    // For new subscription needing payment
    return {
      success: true,
      clientSecret: data.clientSecret,
      ephemeralKey: data.ephemeralKey,
      customerId: data.customerId,
      subscriptionId: data.subscriptionId
    };
  } catch (error) {
    console.error('Subscription error:', error);
    throw error;
  }
};
