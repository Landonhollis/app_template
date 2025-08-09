import { useAccount } from '../account/accountProvider'
import { View } from 'react-native'
import "../global.css"
import Auth from './screens/auth'
import HomeScreen from './screens/homeScreen'

export default function App() {
  const { ps, isAuthenticated } = useAccount()

  return (
    <View className="flex-1" style={ps('bg-1')}>
      {isAuthenticated ? <HomeScreen/> : <Auth />}
    </View>
  )
}