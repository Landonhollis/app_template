import { supabase } from "../auth/supaBase";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getAccountData, updateThemeName, updateNotifications } from '../callers/forAccountProviderData'
import { createUserAccount } from '../auth/auth'


//account = 

//  from Supabase: 
// theme_name, ---- turns into ctn
// user_id, 
// notifications, 
// stripe_connect_status, 
// stripe_connect_account_id, 
// stripe_connect_created_at

//  not Supabase: 
// ct, 
// ctn, 
// setCtn(), 
// themeLoading, 
// ps(), 
// currentThemeName(for status bar)



// imports from callers: getAccountData, setCtn, setNotifications



export const allThemes = {
  theme1: {
    themeName:'', 
    'f-1': { fontFamily: 'Lora' }, 
    'f-2': { fontFamily: 'Lora-Italic' }, 
    'f-3': { fontFamily: 'DM' }, 
    'f-4': { fontFamily: 'DM-Italic' }, 
    'f-5': { fontFamily: 'Lora' }, 
    'f-6': { fontFamily: 'Lora' }, 
    'fw-200': { fontWeight: '200' },
    'fw-300': { fontWeight: '300' },
    'fw-400': { fontWeight: '400' },
    'fw-500': { fontWeight: '500' },
    'fw-600': { fontWeight: '600' },
    'fw-700': { fontWeight: '700' },
    'fw-800': { fontWeight: '800' },
    'br-0': { borderRadius: 0 }, 
    'br-1': { borderRadius: 2 }, 
    'br-2': { borderRadius: 4 },
    'br-3': { borderRadius: 8 },
    'br-4': { borderRadius: 12 },
    'bw-0': { borderWidth: 0 }, 
    'bw-1': { borderWidth: 0.5 }, 
    'bw-2': { borderWidth: 2 }, 
    'bw-3': { borderWidth: 4 },
    'bw-4': { borderWidth: 8 },
    'bw-l-1': { borderLeftWidth: 0.5 }, 
    'bw-l-2': { borderLeftWidth: 2 }, 
    'bw-l-3': { borderLeftWidth: 4 },
    'bw-l-4': { borderLeftWidth: 8 },
    'bw-r-1': { borderRightWidth: 0.5 }, 
    'bw-r-2': { borderRightWidth: 2 }, 
    'bw-r-3': { borderRightWidth: 4 },
    'bw-r-4': { borderRightWidth: 8 },
    'bw-t-1': { borderTopWidth: 0.5 }, 
    'bw-t-2': { borderTopWidth: 2 }, 
    'bw-t-3': { borderTopWidth: 4 },
    'bw-t-4': { borderTopWidth: 8 },
    'bw-b-1': { borderBottomWidth: 0.5 }, 
    'bw-b-2': { borderBottomWidth: 2 }, 
    'bw-b-3': { borderBottomWidth: 4 },
    'bw-b-4': { borderBottomWidth: 8 },
    'bg-1': { backgroundColor: "rgb(17, 17, 17)" }, 
    'bg-2': { backgroundColor: "rgb(27, 27, 27)" },
    'bg-3': { backgroundColor: "rgb(60, 60, 60)" },
    'bg-4': { backgroundColor: "rgb(39, 38, 33)" },
    'bg-5': { backgroundColor: "rgb(45, 45, 45)" },
    'bg-6': { backgroundColor: "rgb(55, 55, 55)" },
    'bg-a1': { backgroundColor: "rgb(39, 38, 33)" },
    'bg-a2': { backgroundColor: "rgb(49, 48, 43)" },
    'bg-a3': { backgroundColor: "rgb(59, 58, 53)" },
    'text-normal': { color: "rgb(185, 185, 185)" },
    'text-muted': { color: "rgb(132, 132, 132)" },
    'text-strong': { color: "rgb(212, 212, 212)" },
    'text-a1': { color: "rgb(251, 191, 36)" },
    'text-a2': { color: "rgb(155, 106, 50)" },
    'text-a3': { color: "rgb(143, 110, 72)" },
    'text-inverse': { color: "rgb(23, 23, 23)" },
    'text-xs': { fontSize: 12 },
    'text-sm': { fontSize: 14 },
    'text-md': { fontSize: 16 },
    'text-lg': { fontSize: 18 },
    'text-xl': { fontSize: 20 },
    'text-2xl': { fontSize: 24 },
    'bc-normal': { borderColor: "rgb(99, 99, 99)" },
    'bc-muted': { borderColor: "rgb(75, 75, 75)" },
    'bc-strong': { borderColor: "rgb(212, 212, 212)" },
    'bc-accent': { borderColor: "rgb(237, 171, 17)" },
    'shadow-1': { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.18, shadowRadius: 1.0, elevation: 2 }, 
    'shadow-2': { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 4 }, 
    'shadow-3': { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.30, shadowRadius: 4.65, elevation: 6 },
    'sb-style': 'light', // Light text for dark theme
  }, 
  theme2: {
    themeName:'', 
    'f-1': { fontFamily: 'Lora' }, 
    'f-2': { fontFamily: 'Lora-Italic' }, 
    'f-3': { fontFamily: 'DM' }, 
    'f-4': { fontFamily: 'DM-Italic' }, 
    'f-5': { fontFamily: 'Lora' }, 
    'f-6': { fontFamily: 'Lora' }, 
    'fw-200': { fontWeight: '200' },
    'fw-300': { fontWeight: '300' },
    'fw-400': { fontWeight: '400' },
    'fw-500': { fontWeight: '500' },
    'fw-600': { fontWeight: '600' },
    'fw-700': { fontWeight: '700' },
    'fw-800': { fontWeight: '800' },
    'br-0': { borderRadius: 0 }, 
    'br-1': { borderRadius: 2 }, 
    'br-2': { borderRadius: 4 },
    'br-3': { borderRadius: 8 },
    'br-4': { borderRadius: 12 },
    'bw-0': { borderWidth: 0 }, 
    'bw-1': { borderWidth: 0.5 }, 
    'bw-2': { borderWidth: 2 }, 
    'bw-3': { borderWidth: 4 },
    'bw-4': { borderWidth: 8 },
    'bw-l-1': { borderLeftWidth: 0.5 }, 
    'bw-l-2': { borderLeftWidth: 2 }, 
    'bw-l-3': { borderLeftWidth: 4 },
    'bw-l-4': { borderLeftWidth: 8 },
    'bw-r-1': { borderRightWidth: 0.5 }, 
    'bw-r-2': { borderRightWidth: 2 }, 
    'bw-r-3': { borderRightWidth: 4 },
    'bw-r-4': { borderRightWidth: 8 },
    'bw-t-1': { borderTopWidth: 0.5 }, 
    'bw-t-2': { borderTopWidth: 2 }, 
    'bw-t-3': { borderTopWidth: 4 },
    'bw-t-4': { borderTopWidth: 8 },
    'bw-b-1': { borderBottomWidth: 0.5 }, 
    'bw-b-2': { borderBottomWidth: 2 }, 
    'bw-b-3': { borderBottomWidth: 4 },
    'bw-b-4': { borderBottomWidth: 8 },
    'bg-1': { backgroundColor: "rgb(185, 185, 185)" },
    'bg-2': { backgroundColor: "rgb(212, 212, 212)" },
    'bg-3': { backgroundColor: "rgb(241, 241, 241)" },
    'bg-4': { backgroundColor: "rgb(214, 212, 206)" },
    'bg-5': { backgroundColor: "rgb(195, 195, 195)" },
    'bg-6': { backgroundColor: "rgb(225, 225, 225)" },
    'bg-a1': { backgroundColor: "rgb(255, 191, 0)" },
    'bg-a2': { backgroundColor: "rgb(239, 225, 180)" },
    'bg-a3': { backgroundColor: "rgb(234, 232, 226)" },
    'text-normal': { color: "rgb(40, 40, 40)" },
    'text-muted': { color: "rgb(120, 120, 120)" },
    'text-strong': { color: "rgb(17, 17, 17)" },
    'text-a1': { color: "rgb(251, 191, 36)" },
    'text-a2': { color: "rgb(155, 106, 50)" },
    'text-a3': { color: "rgb(143, 110, 72)" },
    'text-inverse': { color: "rgb(255, 255, 255)" },
    'text-xs': { fontSize: 12 },
    'text-sm': { fontSize: 14 },
    'text-md': { fontSize: 16 },
    'text-lg': { fontSize: 18 },
    'text-xl': { fontSize: 20 },
    'text-2xl': { fontSize: 24 },
    'bc-normal': { borderColor: "rgb(27, 27, 27)" },
    'bc-muted': { borderColor: "rgb(120, 120, 120)" },
    'bc-strong': { borderColor: "rgb(17, 17, 17)" },
    'bc-accent': { borderColor: "rgb(237, 171, 17)" },
    'shadow-1': { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.18, shadowRadius: 1.0, elevation: 2 }, 
    'shadow-2': { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 4 }, 
    'shadow-3': { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.30, shadowRadius: 4.65, elevation: 6 },
    'sb-style': 'dark',
  }, 
  theme3: {
    themeName:'', 
    'f-1': { fontFamily: 'Lora' }, 
    'f-2': { fontFamily: 'Lora-Italic' }, 
    'f-3': { fontFamily: 'DM' }, 
    'f-4': { fontFamily: 'DM-Italic' }, 
    'f-5': { fontFamily: 'Lora' }, 
    'f-6': { fontFamily: 'Lora' }, 
    'fw-200': { fontWeight: '200' },
    'fw-300': { fontWeight: '300' },
    'fw-400': { fontWeight: '400' },
    'fw-500': { fontWeight: '500' },
    'fw-600': { fontWeight: '600' },
    'fw-700': { fontWeight: '700' },
    'fw-800': { fontWeight: '800' },
    'br-0': { borderRadius: 0 }, 
    'br-1': { borderRadius: 2 }, 
    'br-2': { borderRadius: 4 },
    'br-3': { borderRadius: 8 },
    'br-4': { borderRadius: 12 },
    'bw-0': { borderWidth: 0 }, 
    'bw-1': { borderWidth: 0.5 }, 
    'bw-2': { borderWidth: 2 }, 
    'bw-3': { borderWidth: 4 },
    'bw-4': { borderWidth: 8 },
    'bw-l-1': { borderLeftWidth: 0.5 }, 
    'bw-l-2': { borderLeftWidth: 2 }, 
    'bw-l-3': { borderLeftWidth: 4 },
    'bw-l-4': { borderLeftWidth: 8 },
    'bw-r-1': { borderRightWidth: 0.5 }, 
    'bw-r-2': { borderRightWidth: 2 }, 
    'bw-r-3': { borderRightWidth: 4 },
    'bw-r-4': { borderRightWidth: 8 },
    'bw-t-1': { borderTopWidth: 0.5 }, 
    'bw-t-2': { borderTopWidth: 2 }, 
    'bw-t-3': { borderTopWidth: 4 },
    'bw-t-4': { borderTopWidth: 8 },
    'bw-b-1': { borderBottomWidth: 0.5 }, 
    'bw-b-2': { borderBottomWidth: 2 }, 
    'bw-b-3': { borderBottomWidth: 4 },
    'bw-b-4': { borderBottomWidth: 8 },
    'bg-1': { backgroundColor: "rgb(17, 17, 17)" }, 
    'bg-2': { backgroundColor: "rgb(27, 27, 27)" },
    'bg-3': { backgroundColor: "rgb(60, 60, 60)" },
    'bg-4': { backgroundColor: "rgb(39, 38, 33)" },
    'bg-5': { backgroundColor: "rgb(45, 45, 45)" },
    'bg-6': { backgroundColor: "rgb(55, 55, 55)" },
    'bg-a1': { backgroundColor: "rgb(218, 145, 11)" },
    'bg-a2': { backgroundColor: "rgb(114, 86, 26)" },
    'bg-a3': { backgroundColor: "rgb(59, 58, 53)" },
    'text-normal': { color: "rgb(185, 185, 185)" },
    'text-muted': { color: "rgb(132, 132, 132)" },
    'text-strong': { color: "rgb(212, 212, 212)" },
    'text-a1': { color: "rgb(251, 191, 36)" },
    'text-a2': { color: "rgb(155, 106, 50)" },
    'text-a3': { color: "rgb(143, 110, 72)" },
    'text-inverse': { color: "rgb(255, 255, 255)" },
    'text-xs': { fontSize: 12 },
    'text-sm': { fontSize: 14 },
    'text-md': { fontSize: 16 },
    'text-lg': { fontSize: 18 },
    'text-xl': { fontSize: 20 },
    'text-2xl': { fontSize: 24 },
    'bc-normal': { borderColor: "rgb(99, 99, 99)" },
    'bc-muted': { borderColor: "rgb(75, 75, 75)" },
    'bc-strong': { borderColor: "rgb(212, 212, 212)" },
    'bc-accent': { borderColor: "rgb(237, 171, 17)" },
    'shadow-1': { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.18, shadowRadius: 1.0, elevation: 2 }, 
    'shadow-2': { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 4 }, 
    'shadow-3': { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.30, shadowRadius: 4.65, elevation: 6 },
    'sb-style': 'light',
  }, 
  theme4: {
    themeName:'', 
    'f-1': { fontFamily: 'Lora' }, 
    'f-2': { fontFamily: 'Lora-Italic' }, 
    'f-3': { fontFamily: 'DM' }, 
    'f-4': { fontFamily: 'DM-Italic' }, 
    'f-5': { fontFamily: 'Lora' }, 
    'f-6': { fontFamily: 'Lora' }, 
    'fw-200': { fontWeight: '200' },
    'fw-300': { fontWeight: '300' },
    'fw-400': { fontWeight: '400' },
    'fw-500': { fontWeight: '500' },
    'fw-600': { fontWeight: '600' },
    'fw-700': { fontWeight: '700' },
    'fw-800': { fontWeight: '800' },
    'br-0': { borderRadius: 0 }, 
    'br-1': { borderRadius: 2 }, 
    'br-2': { borderRadius: 4 },
    'br-3': { borderRadius: 8 },
    'br-4': { borderRadius: 12 },
    'bw-0': { borderWidth: 0 }, 
    'bw-1': { borderWidth: 0.5 }, 
    'bw-2': { borderWidth: 2 }, 
    'bw-3': { borderWidth: 4 },
    'bw-4': { borderWidth: 8 },
    'bw-l-1': { borderLeftWidth: 0.5 }, 
    'bw-l-2': { borderLeftWidth: 2 }, 
    'bw-l-3': { borderLeftWidth: 4 },
    'bw-l-4': { borderLeftWidth: 8 },
    'bw-r-1': { borderRightWidth: 0.5 }, 
    'bw-r-2': { borderRightWidth: 2 }, 
    'bw-r-3': { borderRightWidth: 4 },
    'bw-r-4': { borderRightWidth: 8 },
    'bw-t-1': { borderTopWidth: 0.5 }, 
    'bw-t-2': { borderTopWidth: 2 }, 
    'bw-t-3': { borderTopWidth: 4 },
    'bw-t-4': { borderTopWidth: 8 },
    'bw-b-1': { borderBottomWidth: 0.5 }, 
    'bw-b-2': { borderBottomWidth: 2 }, 
    'bw-b-3': { borderBottomWidth: 4 },
    'bw-b-4': { borderBottomWidth: 8 },
    'bg-1': { backgroundColor: "rgb(30, 58, 138)" }, 
    'bg-2': { backgroundColor: "rgb(37, 99, 235)" },
    'bg-3': { backgroundColor: "rgb(59, 130, 246)" },
    'bg-4': { backgroundColor: "rgb(147, 197, 253)" },
    'bg-5': { backgroundColor: "rgb(25, 48, 118)" },
    'bg-6': { backgroundColor: "rgb(45, 85, 200)" },
    'bg-a1': { backgroundColor: "rgb(147, 197, 253)" },
    'bg-a2': { backgroundColor: "rgb(167, 207, 253)" },
    'bg-a3': { backgroundColor: "rgb(187, 217, 253)" },
    'text-normal': { color: "rgb(255, 255, 255)" },
    'text-muted': { color: "rgb(229, 231, 235)" },
    'text-strong': { color: "rgb(243, 244, 246)" },
    'text-a1': { color: "rgb(251, 191, 36)" },
    'text-a2': { color: "rgb(155, 106, 50)" },
    'text-a3': { color: "rgb(143, 110, 72)" },
    'text-inverse': { color: "rgb(2, 6, 49)" },
    'text-xs': { fontSize: 12 },
    'text-sm': { fontSize: 14 },
    'text-md': { fontSize: 16 },
    'text-lg': { fontSize: 18 },
    'text-xl': { fontSize: 20 },
    'text-2xl': { fontSize: 24 },
    'bc-normal': { borderColor: "rgb(156, 163, 175)" },
    'bc-muted': { borderColor: "rgb(107, 114, 128)" },
    'bc-strong': { borderColor: "rgb(75, 85, 99)" },
    'bc-accent': { borderColor: "rgb(237, 171, 17)" },
    'shadow-1': { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.18, shadowRadius: 1.0, elevation: 2 }, 
    'shadow-2': { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 4 }, 
    'shadow-3': { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.30, shadowRadius: 4.65, elevation: 6 },
    'sb-style': 'light',
  }, 
};

type Ct = typeof allThemes.theme1
type Ctn = 'theme1' | 'theme2' | 'theme3' | 'theme4'
type SubscriptionType = 'free' | 'basic_monthly' | 'basic_yearly' | 'pro_monthly' | 'pro_yearly'

interface Account {
  userId?: string | null
  email?: string | null
  isAuthenticated: boolean
  notifications: boolean
  changeNotifications: (notifications: boolean) => void
  ctn: Ctn
  setTheme: (themeName: Ctn) => Promise<void>
  ct: Ct
  themeLoading: boolean
  ps: (styleString: string) => object
  subscription: SubscriptionType
  changeSubscription: (subscriptionType: SubscriptionType) => void
  stripeConnectStatus: string | null
  stripeConnectAccountId: string | null
  stripeConnectCreatedAt: string | null
  customerId: string | null
  loadAccountData: () => Promise<void>
}

const Account = createContext<Account | undefined>(undefined)




export const AccountProvider = ({ children }: { children: ReactNode }) => {

  //----------------------------states-----------------------------|

  //check this to change account data
  const [userId, setUserId] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  
  //account data
    const [notifications, setNotifications] = useState<boolean>(true)

    const [ctn, setCtn] = useState<Ctn>('theme1')
    const ct = allThemes[ctn] as Ct
    const [themeLoading, setThemeLoading] = useState(true)
    const [subscription, setSubscription] = useState<SubscriptionType>('free')
    const [stripeConnectStatus, setStripeConnectStatus] = useState<string | null>(null)
    const [stripeConnectAccountId, setStripeConnectAccountId] = useState<string | null>(null)
    const [stripeConnectCreatedAt, setStripeConnectCreatedAt] = useState<string | null>(null)
    const [customerId, setCustomerId] = useState<string | null>(null)
  // end of account data
  // avalible to hook: set theme(). done. 
  // avalible to hook: ps()


  //---------------------------is authenticated functions-----------------------------|

  // Listen to auth state changes
  useEffect(() => {
    // Check initial session
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsAuthenticated(!!session?.user?.id)
      
      if (session?.user?.id) {
        setUserId(session.user.id)
        setEmail(session.user.email || null)
        loadAccountData()
      } else {
        setUserId(null)
        setEmail(null)
        setIsAuthenticated(false)
        clearAccountData()
      }
    }
    checkAuth()
    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session?.user?.id)
      
      if (session?.user?.id) {
        setUserId(session.user.id)
        setEmail(session.user.email || null)
        loadAccountData()
      } else {
        setThemeLoading(true)
        setUserId(null)
        setEmail(null)
        setIsAuthenticated(false)
        clearAccountData()
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const loadAccountData = async () => {
    setThemeLoading(true)
    const { data: { session } } = await supabase.auth.getSession()


    // Create account if it doesn't exist
    if (userId) {
      await createUserAccount(session?.user?.id || userId)
    }
    
    const data = await getAccountData()
    if (data) {
      setNotifications(data.notifications ?? true)
      setCtn(data.theme_name as Ctn || 'theme1')
      setSubscription(data.subscription as SubscriptionType || 'free')
      setStripeConnectStatus(data.stripe_connect_status || null)
      setStripeConnectAccountId(data.stripe_connect_account_id || null)
      setStripeConnectCreatedAt(data.stripe_connect_created_at || null)
      setCustomerId(data.customer_id || null)
      setThemeLoading(false)
    } else {
      console.log('No account data found for user:', userId)
      setThemeLoading(false)
    }
  }

  const clearAccountData = () => {
    setNotifications(true);
    setCtn('theme1');
    setSubscription('free');
    setStripeConnectStatus(null);
    setStripeConnectAccountId(null);
    setStripeConnectCreatedAt(null);
    setCustomerId(null);
    setThemeLoading(false);
  }

  //----------------------------utility functions--------------------------------------|

  const setTheme = async (themeName: Ctn) => {
    setCtn(themeName)
    try {
      updateThemeName(themeName)
    } catch (error) {
      console.log('Error updating theme name:')
    }
  }

  const ps = (styleString: string) => {
    const styles = styleString
      .split(' ')
      .filter(Boolean)
      .map(className => ct[className as keyof typeof ct])
      .filter(Boolean)
    
    // Merge all styles into a single object
    return Object.assign({}, ...styles)
  }

  const changeNotifications = async (notifications: boolean) => {
    setNotifications(notifications)
    try {
      await updateNotifications(notifications)
    } catch (error) {
      console.log('Error updating notifications:', error)
    }
  }

  const changeSubscription = (subscriptionType: SubscriptionType) => {
    setSubscription(subscriptionType)
  }

  return (
    <Account.Provider value={{ 
      userId,
      email,   
      isAuthenticated, 
      notifications,
      changeNotifications, 
      ctn, 
      setTheme,
      ct, 
      themeLoading,
      ps,
      subscription,
      changeSubscription,
      stripeConnectStatus,
      stripeConnectAccountId,
      stripeConnectCreatedAt,
      customerId,
      loadAccountData, 
    }}>
      {children}
    </Account.Provider>
  )
}


// this is for the status bar component in the _layout file. it should stay seperate from the theme provider
export const useAccount = () => {
  const context = useContext(Account)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}






