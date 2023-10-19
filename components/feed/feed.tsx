"use client";
import FeaturedDev from "./featured/featured-dev";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
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
          setFeaturedDevs(userData.users);
          setIsLoaded(true);
        } catch (error) {
          // Handle errors
          console.error('Error:', error);
        }
      }
    }

    

    fetchData();
  }, [status]);
     return (
          <div className="feed__content_featured">
           {
            featuredDevs?.length !== 0 && (
              <FeaturedDev data={featuredDevs} isloaded={isLoaded} />
            )
           }
          </div>
     )
}