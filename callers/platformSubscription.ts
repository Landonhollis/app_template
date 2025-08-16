
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
    
    // Check if response is ok and content-type is JSON
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Response Error:', response.status, errorText);
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const responseText = await response.text();
      console.error('Non-JSON Response:', responseText);
      throw new Error(`Expected JSON response, got: ${contentType}. Response: ${responseText}`);
    }
    
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
