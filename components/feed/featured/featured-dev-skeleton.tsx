'use client';

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import { Suspense, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { getSessionUser } from "@/components/get-session-user";
import { useSession } from "next-auth/react";
import { Icons } from "@/components/icon";
import UserHoverCard from "@/components/user-hover-card";
import Link from "next/link";
import { cn } from "@/lib/utils";

const formatDate = (dateString: string | number | Date) => {
  const date = new Date(dateString)
  const currentYear = new Date().getFullYear()
  const year = date.getFullYear()
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour12: true,
  })
  if (year !== currentYear) {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour12: true,
    })
  }
  return formattedDate
}

export default function FeaturedDevSkeleton(
  { ...props }: React.ComponentPropsWithoutRef<typeof Card>) {

  return (
    <Card className={cn("feed__content_featured_card bg-background border-none shadow-none", props.className)} {...props}>
      <CardHeader className="py-4 px-0">
        <CardTitle className="feed__content_featured_card_title text-base">
          <Skeleton className="h-6 w-20" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="feed__content_featured_card_content flex flex-col items-start justify-between space-y-4">
          <div className="flex gap-4 w-full items-center justify-between">
            <div className="flex items-center">
              <Skeleton className="h-8 w-8 rounded-full mr-1.5 md:mr-2" />
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-3.5 w-20" />
              </div>
            </div>
            <Skeleton className="h-8 w-16" />
          </div>
          <div className="flex gap-4 w-full items-center justify-between">
            <div className="flex items-center">
              <Skeleton className="h-8 w-8 rounded-full mr-1.5 md:mr-2" />
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-3.5 w-20" />
              </div>
            </div>
            <Skeleton className="h-8 w-16" />
          </div>
          <div className="flex gap-4 w-full items-center justify-between">
            <div className="flex items-center">
              <Skeleton className="h-8 w-8 rounded-full mr-1.5 md:mr-2" />
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-3.5 w-20" />
              </div>
            </div>
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
