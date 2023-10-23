'use client';
import React from "react";
import { Button } from "../ui/button";

type Props = React.ComponentPropsWithoutRef<typeof Button> & {
     onClick?: () => Promise<void> | void;
     isFollowing: boolean;
}

const FollowTagButton: React.FC<Props> = ({ isFollowing, onClick, ...props }) => {
     return (
          <Button {...props}>
               {isFollowing ? "Following" : "Follow"}
          </Button>
     )
}

export default FollowTagButton;