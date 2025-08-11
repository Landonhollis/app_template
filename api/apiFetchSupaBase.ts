

async function getUserFromDatabase(userId: any) {
 try {
   const { data, error } = await supabase
     .from('users') // or whatever your table is called
     .select('*')
     .eq('user_id', userId)
     .single();

   if (error) {
     throw new Error(`Database error: ${error.message}`);
   }

   if (!data) {
     throw new Error('User not found');
   }

   return data;
 } catch (error) {
   console.error('Error getting user:', error);
   throw error; // Re-throw so calling function can handle it
 }
}