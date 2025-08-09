import { View, Text, Pressable } from 'react-native'
import { useAccount } from '../../account/accountProvider'
import { signOut } from '../../auth/auth'
import React, { useState } from 'react'
import MarketPlaceScreen from './marketPlaceScreen'
import SubscriptionScreen from './subscribtionScreen'

export default function HomeScreen() {
  const [ screen, setScreen ] = useState('home')
  const { ps, email, subscription } = useAccount()

  return (
  <View className="flex-1" style={{marginBottom: 0, marginLeft: 0, marginRight: 0}}>
    {(() => {
      switch (screen) {
        case 'home':
          return (
            <View className="flex-1 items-center justify-center p-12" style={ps('bg-1')}>
              <Text style={ps('text-2xl fw-700 f-1 text-strong')}>Welcome to the Home Screen!</Text>
              <Text className="mt-4" style={ps('text-md f-1 text-normal')}>This is where you can manage your account settings.</Text>
              <Text className="mt-4" style={ps('text-md f-1 text-normal')}>Email: {email}</Text>
              <View>
                <Pressable onPress={() => signOut()} className="m-4 rounded-lg p-4 items-center" style={ps('bg-2 shadow-2')}>
                  <Text style={ps('text-md f-1 text-normal')}>log out</Text>
                </Pressable>
              </View>
            </View>
          );
        
        case 'marketPlace':
          return <MarketPlaceScreen />;

        case 'subscription':
          return <SubscriptionScreen />;
        
        default:
          return <View><Text>Default Screen</Text></View>;
      }
    })()}

    <View className="position-absolute bottom-0 left-0 right-0 p-4 flex-row">
      <Pressable className="flex-1 items-center p-4" style={ps('bw-t-1 bw-l- bw-r-1 bc-strong shadow-2')} onPress={() => setScreen('home')}>
        <Text style={ps('text-normal')}>Home</Text>
      </Pressable>
      <Pressable className="flex-1 items-center p-4" style={ps('bw-t-1 bc-strong shadow-2')} onPress={() => setScreen('subscription')}>
        <Text style={ps('text-normal')}>Subscriptions</Text>
      </Pressable>
      <Pressable className="flex-1 items-center p-4" style={ps('bw-l-1 bw-t-1 bc-strong shadow-2')} onPress={() => setScreen('marketPlace')}>
        <Text style={ps('text-normal')}>MKT Place</Text>
      </Pressable>
    </View>
  </View>
);
}