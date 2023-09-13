export async function getUserByUsername(username: string) {
     try {
       const response = await fetch(`/api/users/${username}`);
       if (!response.ok) {
         throw new Error(`Error fetching user data: ${response.statusText}`);
       }
       const data = await response.json();
       return data.user;
     } catch (error) {
       console.error('Error fetching user data:', error);
       throw error;
     }
   }