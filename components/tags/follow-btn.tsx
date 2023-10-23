'use client';
import React from "react";
import { Button } from "../ui/button";

type Props = React.ComponentPropsWithoutRef<typeof Button> & {
     onClick?: () => Promise<void> | void;
     children: React.ReactNode;
}

const FollowTagButton: React.FC<Props> = ({ onClick, children, ...props }) => {
     return (
          <Button onClick={async () => {
               onClick && await onClick()
          }} {...props}>
               {children}
          </Button>
     )
}

export default FollowTagButton;