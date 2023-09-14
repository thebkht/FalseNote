export async function getUserByUsername(username: string) {
     try {
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

export async function getFeaturedDevs() {
      try {
        const response = await fetch("/api/users");
        if (!response.ok) {
          throw new Error(`Error fetching featured devs: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching featured devs:', error);
        throw error;
      }
}