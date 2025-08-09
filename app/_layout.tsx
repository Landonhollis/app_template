import { useFonts } from 'expo-font'
import { Slot } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import '../global.css'
import { AccountProvider } from '../account/accountProvider'
import { useAccount } from '../account/accountProvider'
import { useEffect, useState } from 'react'
import { StripeProvider } from '@stripe/stripe-react-native';





// Component that handles themed status bar - must be inside ThemeProvider
function ThemedStatusBar() {
  const account = useAccount();

  return (
    <StatusBar 
      translucent 
      backgroundColor="transparent"
      style={account ? account.ct['sb-style'] as 'light' | 'dark' : 'light'}
    />
  );
}

export default function RootLayout() {
  
  const [publishableKey, setPublishableKey] = useState('');

  const [fontsLoaded] = useFonts({
    'Lora': require('../assets/fonts/Lora.ttf'),
    'Lora-Italic': require('../assets/fonts/Lora-Italic.ttf'),
    'DM': require('../assets/fonts/DM.ttf'),
    'DM-Italic': require('../assets/fonts/DM-Italic.ttf'),
  });

  
  //replace fetch key with a function that actuallly fetches the key from your server
  const fetchKey = () => {
    return 'pk_test_51RYujv01yUVx1S6mQinbgHz2YapWuWzHI63A1cLPHA7dpY1a4xLz7mYTMqPR44Qo10WSRXlIFnru0OJaS4TDVdkg00dKye1xVx'
  }

  
  useEffect(() => {
    fetchPublishableKey();
  }, []);
  
  const fetchPublishableKey = async () => {
    const key = await fetchKey();
    setPublishableKey(key);
  };


  if (!fontsLoaded) {
    return null;
  }


  return (
    <StripeProvider
      publishableKey={publishableKey}
      merchantIdentifier="Template App" // required for Apple Pay
      urlScheme="com.anonymous.app-template" // required for 3D Secure and bank redirects
    >
      <AccountProvider>
        <SafeAreaProvider className="flex-1">
          <ThemedStatusBar />
          <View className="flex-1" style={{ backgroundColor: 'transparent' }}>
            <Slot />
          </View>
        </SafeAreaProvider>
      </AccountProvider>
    </StripeProvider>
  );
}