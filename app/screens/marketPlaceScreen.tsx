import { View, Text, Pressable } from 'react-native'
import { useAccount } from '../../account/accountProvider'
import { signOut } from '../../auth/auth'

export default function MarketPlaceScreen() {
  const { ps, email, subscription } = useAccount()

  return (
    <View className="flex-1 items-center justify-center p-12" style={ps('bg-1')}>
      <Text style={ps('text-2xl fw-700 f-1 text-strong')}>Welcome to the Market Place Screen!</Text>
    </View>
  )
}