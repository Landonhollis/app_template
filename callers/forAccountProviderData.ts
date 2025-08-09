import { supabase } from '../auth/supaBase'

const getAccountData = async (): Promise<any | null> => {
 try {
   const { data: { user } } = await supabase.auth.getUser()
   if (!user?.id) return null

   const { data, error } = await supabase
     .from('accounts')
     .select('*')
     .eq('user_id', user.id)
     .single()

   if (error) {
     if (error.code === 'PGRST116') {
       return null // No record found
     }
     throw error
   }

   return data
 } catch (error) {
   console.error('Unexpected error fetching account data:', error)
   return null
 }
}

const updateThemeName = async (themeName: string): Promise<boolean> => {
 try {
   const { data: { user } } = await supabase.auth.getUser()
   if (!user?.id) return false

   const { error } = await supabase
     .from('accounts')
     .update({ theme_name: themeName })
     .eq('user_id', user.id)

   if (error) {
     console.error('Error updating theme name:', error)
     return false
   }

   return true
 } catch (error) {
   console.error('Unexpected error updating theme name:', error)
   return false
 }
}

const updateNotifications = async (notifications: boolean): Promise<boolean> => {
 try {
   const { data: { user } } = await supabase.auth.getUser()
   if (!user?.id) return false

   const { error } = await supabase
     .from('accounts')
     .update({ notifications: notifications })
     .eq('user_id', user.id)

   if (error) {
     console.error('Error updating notifications:', error)
     return false
   }

   return true
 } catch (error) {
   console.error('Unexpected error updating notifications:', error)
   return false
 }
}

export {
  getAccountData,
  updateThemeName,
  updateNotifications,
}


