import React, { useState } from 'react'
import { Alert, AppState, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { useAccount } from '../../account/accountProvider'
import { supabase } from '../../auth/supaBase'

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { ps } = useAccount()

  const signInWithGoogle = async () => {
    console.log('Trying to sign in with Google')
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      })
      console.log('OAuth response:', { data, error })
      if (error) console.log('Error: ', error.message)
    } catch (err) {
      console.log('Catch error:', err)
    }
  }

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  async function signUpWithEmail() {
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    if (!session) Alert.alert('Please check your inbox for email verification!')
    setLoading(false)
  }

  return (
    <ScrollView className="flex-1 p-4" style={ps('bg-3')}>
      
      <Pressable className="m-4 rounded-lg p-4 items-center" style={ps('bg-a1 shadow-2')} onPress={signInWithGoogle}>
        <Text style={ps('text-inverse fw-600 f-1')}>Sign in with Google</Text>
      </Pressable>
      <View className="m-4">
        <Text className="mb-2" style={ps('text-md fw-500 f-1 text-normal')}>Email</Text>
        <TextInput
          className="rounded-lg p-3"
          style={ps('bg-6 bc-normal bw-1 text-normal f-1')}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
        />
      </View>
      <View className="m-4">
        <Text className="mb-2" style={ps('text-md fw-500 f-1 text-normal')}>Password</Text>
        <TextInput
          className="rounded-lg p-3"
          style={ps('bg-6 bc-normal bw-1 text-normal f-1')}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
        />
      </View>
      <View className="m-4">
        <Pressable 
          className="rounded-lg p-4 items-center"
          style={[ps('bg-a2 shadow-1'), { opacity: loading ? 0.5 : 1 }]}
          disabled={loading} 
          onPress={() => signInWithEmail()}
        >
          <Text style={ps('text-inverse fw-600 f-1')}>Sign in</Text>
        </Pressable>
      </View>
      <View className="m-4">
        <Pressable 
          className="rounded-lg p-4 items-center"
          style={[ps('bg-1 shadow-1'), { opacity: loading ? 0.5 : 1 }]}
          disabled={loading} 
          onPress={() => signUpWithEmail()}
        >
          <Text style={ps('text-normal fw-600 f-1')}>Sign up</Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}

