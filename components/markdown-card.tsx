/* eslint-disable @next/next/no-img-element */
import { PreBlock } from "@/lib/syntax"
import { cn } from "@/lib/utils"
import Markdown from "markdown-to-jsx"

export default function MarkdownCard({ code, className }: { code: string, className?: string }) {
     return (
          <article className={cn("article__content prose-neutral dark:prose-invert prose-img:rounded-xl prose-a:text-primary prose-code:bg-popover prose-pre:!bg-popover prose-code:text-foreground prose-pre:text-foreground !max-w-full prose lg:prose-xl", className)}>
               <Markdown options={{
                    overrides: {
                         pre: PreBlock,
                         img: {
                              component: (props: any) => {
                                   return props.title ? (
                                        <figure>
                                             <img {...props} className="!relative w-full" alt={props.alt} />
                                             <figcaption className="text-center text-sm text-muted">{props.title}</figcaption>
                                        </figure>
                                   ) : (
                                        <img {...props} className="!relative w-full" alt={props.alt} />
                                   )
                              }
                         },
                    },
               }}>
                    {code}
               </Markdown>
          </article>
     )
}