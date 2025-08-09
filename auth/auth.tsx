import { supabase } from './supaBase'

export const createUserAccount = async (userId: string) => {
  console.log('Checking and creating user account if needed...')
  const { data: { user } } = await supabase.auth.getUser();


  const { data: existingAccount, error: selectError } = await supabase
    .from('accounts')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!existingAccount) {
    console.log('No account found, creating default account for user:', userId);

    const { error } = await supabase.from('accounts').insert({
      user_id: userId,
      email: user?.email || null, 
      theme_name: 'theme1',
      notifications: true,
      subscription: 'free',
      stripe_connect_status: null,
      stripe_connect_account_id: null,
      stripe_connect_created_at: null
    });
    
    if (error) {
      console.error('Error creating user account:', error);
    }
  }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.log('Error signing out:', error.message)
    return false
  }
  return true
}