"use client";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import FeaturedDev from "./featured/featured-dev";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function EmptyFeed() {
  const [featuredDevs, setFeaturedDevs] = useState([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await fetch(`/api/users/top`, {
          method: "GET",
          }).then((res) => res.json());
        setFeaturedDevs(userData);
        setIsLoaded(true);
      } catch (error) {
        // Handle errors
        console.error('Error:', error);
      }
    }

    

    fetchData();
  }, []);
     return (
          <>
         <FeaturedDev data={featuredDevs} isloaded={isLoaded} />
          </>
     )
}