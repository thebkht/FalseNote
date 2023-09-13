import { useSession } from "next-auth/react";

// Create a functional component to fetch and display the username
async function UsernameDisplay() {
  const session = useSession();

  if (!session.data) {
    console.error("User is not authenticated");
    return null;
  }

  // Function to fetch the username from the API
  async function getUsername() {
    try {
      const response = await fetch("/api/get-username");
      if (response.ok) {
        const data = await response.json();
        return data.username;
      } else {
        console.error("Error fetching username:", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Error fetching username:", error);
      return null;
    }
  }

  const username = await getUsername();
  console.log("Username:", username);

  return username;
}

export default UsernameDisplay;
