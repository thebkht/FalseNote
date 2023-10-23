export async function getUserByUsername(username: string) {
     try {
      if (!username) {
        throw new Error("Username is required.");
      }
          const encodedString = username.replace(/ /g, "%20");
       const response = await fetch(`/api/users/${encodedString}`);
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