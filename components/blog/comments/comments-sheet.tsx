import {
     Sheet,
     SheetContent,
     SheetHeader,
     SheetTitle,
} from "@/components/ui/sheet"

import React, { useEffect } from "react";
import CommentForm from "./comment-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import useWindowDimensions from "@/components/window-dimensions";
import CommentCard from "./comment-card";
import { formatNumberWithSuffix } from "@/components/format-numbers";

export default function CommentsSheet({ post, comments, session, ...props }: React.ComponentPropsWithoutRef<typeof Sheet> & { post: any, comments: any, session: any }) {
     const [commentsRef, setComments] = React.useState<any>(comments);
     useEffect(() => {
          setComments(comments);
     }, [comments])

     const { width } = useWindowDimensions();

     return (
          <Sheet {...props}>
               <SheetContent className="p-0 md:max-w-[500px] md:h-full h-3/4 md:rounded-none rounded-md" side={width ? (width <= 768 ? "bottom" : "right") : "right"}>
                    <ScrollArea className="flex flex-col p-6 w-full h-full">
                         <SheetHeader>
                              <SheetTitle>Comments {post._count.comments > 0 && `(${formatNumberWithSuffix(post._count.comments)})`}</SheetTitle>
                         </SheetHeader>
                         <div className="flex flex-col">
                              <CommentForm session={session} post={post} />
                              {
                                   commentsRef.length > 0 && (
                                        <div className="article__comments-list divide-y my-4 space-y-4">
                                             {
                                                  commentsRef?.map((comment: any) => (
                                                       <div className="article__comments-item flex gap-3 space-y-3" key={comment.id}>
                                                            <CommentCard comment={comment} post={post} session={session} />
                                                       </div>
                                                  ))
                                             }
                                        </div>
                                   )
                              }
                         </div>
                    </ScrollArea>
               </SheetContent>
          </Sheet>

     )
}