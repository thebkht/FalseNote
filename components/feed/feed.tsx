"use client";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import FeaturedDev from "./featured/featured-dev";
import { useEffect, useState } from "react";
import { getFeaturedDevs, getUserByUsername } from "../get-user";
import { useSession } from "next-auth/react";

export default function Feed() {
  const [featuredDevs, setFeaturedDevs] = useState([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [user, setUser] = useState<any | null>(null); // Replace 'any' with the actual type of your user data
  const { data: session } = useSession(); // You might need to adjust this based on how you use the session

  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await getFeaturedDevs();
        const sessionData = await getUserByUsername(session?.user?.name as string);
        setUser(sessionData);
        setFeaturedDevs(userData.users);
        setIsLoaded(true);
      } catch (error) {
        // Handle errors
        console.error('Error:', error);
      }
    }

    

    fetchData();
  }, [session?.user?.name]);
     return (
          <>
               <main className="flex min-h-screen flex-col items-center justify-between feed ">
      <div className="feed__content">
      <div className="feed__empty">
         <div className="feed__empty_title">My Feed</div>
         <div className="feed__empty_subtitle">There either has been no new posts, or you don&apos;t follow anyone.</div>
         <div className="search feed__empty_search max-w-[500px]">
           <div className="search-container">
             <div className="search__form">
             <div className="input">
               <div className="input__icon">
                 <Search className='search__form_icon' />
               </div>
               <Input placeholder="Search for people or tags" className="input__field !foucs-visible:ring-0 !focus-visible:ring-offset-0 !focus-visible:outline-none" />
             </div>
             </div>
           </div>
         </div>
         <FeaturedDev data={featuredDevs} isloaded={isLoaded} sessionUser={user} />
       </div>
      </div>
     </main>
          </>
     )
}