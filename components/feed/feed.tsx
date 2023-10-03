"use client";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import FeaturedDev from "./featured/featured-dev";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { get } from "http";
import { getSessionUser } from "../get-session-user";

export default function EmptyFeed() {
  const [featuredDevs, setFeaturedDevs] = useState([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const { status, data: session } = useSession();

  useEffect(() => {
    async function fetchData() {
      if (status !== "unauthenticated") {
        try {
          const userid = (await getSessionUser()).userid;
          const userData = await fetch(`/api/users/top?user=${userid}`, {
            method: "GET",
            }).then((res) => res.json());
          setFeaturedDevs(userData);
          setIsLoaded(true);
        } catch (error) {
          // Handle errors
          console.error('Error:', error);
        }
      }
    }

    

    fetchData();
  }, []);
     return (
          <div className="feed__content_featured">
         <FeaturedDev data={featuredDevs} isloaded={isLoaded} />
          </div>
     )
}