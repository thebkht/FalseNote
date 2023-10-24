'use client';
import React from "react";
import { Button } from "../ui/button";
import LoginDialog from "../login-dialog";
import { useSession } from "next-auth/react";
import { is } from "date-fns/locale";


export default function FollowTagButton({ onClick, Following, ...props } : React.ComponentPropsWithoutRef<typeof Button> & {
     onClick?: () => Promise<void> | void;
     Following?: boolean;
}){
     const { status } = useSession();
     const [isFollowing, setIsFollowing] = React.useState<boolean>(Following || false);
     const [isFollowingLoading, setIsFollowingLoading] = React.useState<boolean>(false);
     return (
          status === "authenticated" ? (
               <Button variant={"secondary"} size={"lg"} disabled={isFollowingLoading} onClick={async () => {
                    setIsFollowingLoading(true);
                    if(onClick) await onClick();
                    setIsFollowingLoading(false);
                    setIsFollowing(!isFollowing);
               }}>
                         {isFollowing ? "Following" : "Follow"}
                    </Button>

          ) : (
               <LoginDialog>
                    <Button variant={"secondary"} size={"lg"}>Follow</Button>
               </LoginDialog>
               
          )
     )
}