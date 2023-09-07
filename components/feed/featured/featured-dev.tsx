"use client"

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { featuredItems } from "./items";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function FeaturedDev() {
  return (
    <div className="feed__empty_featured">
      <Card className="feed__empty_featured_card">
        <CardHeader>
          <CardTitle className="feed__empty_featured_card_title">Featured Devs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="feed__empty_featured_card_content flex flex-col items-start justify-between space-y-4">
            {
              featuredItems.map((item, index) => (
                <div className="flex gap-4 w-full items-center" key={item.name}>
                  <div>
                  <div className="flex">
                  <Avatar>
                    <AvatarImage src={item.profileImg} />
                    <AvatarFallback>{item.fallback}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">{item.name}</p>
                    <p className="text-sm text-muted-foreground">@{item.username}</p>
                  </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.bio}</p>
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