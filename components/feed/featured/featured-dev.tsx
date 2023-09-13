"use client"

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { featuredItems } from "./items";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

export default function FeaturedDev() {
  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(true)
 
  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
  }, [])
  return (
    <div className="feed__empty_featured">
      <Card className="feed__empty_featured_card">
        <CardHeader>
          <CardTitle className="feed__empty_featured_card_title">Featured Devs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="feed__empty_featured_card_content flex flex-col items-start justify-between space-y-4">
            {
              featuredItems.map(item => (
                <div className="flex gap-4 w-full items-center justify-between" key={item.name}>
                  <div>
                  <div className="flex">
                  <Button variant="secondary" className="relative h-8 w-8 mr-4 rounded-full" asChild>
                         <Avatar className="h-8 w-8">
                              <AvatarImage src={item.profileImg} alt={item.username} />
                              <AvatarFallback>{item.fallback}</AvatarFallback>

                         </Avatar>
                    </Button>
                  <div>
                    <p className="text-sm font-medium leading-none">{item.name}</p>
                    <p className="text-sm text-muted-foreground">@{item.username}</p>
                  </div>
                  </div>
                  <p className="text-sm text-muted-foreground hidden md:block">{item.bio}</p>
                  </div>
                  <Button variant="outline" size={"lg"} className="flex-shrink-0">
                    <Plus className="h-4 w-4 mr-2" /> Follow
                  </Button>
                </div>
              ))
            }
          </div>
        </CardContent>
      </Card>
    </div>
  )
}