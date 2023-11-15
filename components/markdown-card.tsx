import { PreBlock } from "@/lib/syntax"
import Markdown from "markdown-to-jsx"

export default function MarkdownCard({ code }: { code: string }) {
     return (
          <article className="article__content prose-neutral markdown-body dark:prose-invert prose-img:rounded-xl prose-a:text-primary prose-code:bg-popover prose-pre:!bg-popover prose-code:text-foreground prose-pre:text-foreground !max-w-full prose lg:prose-xl">
               <Markdown options={{
                    overrides: {
                         pre: PreBlock,
                         img: {
                              component: (props: any) => {
                                   return (
                                        <figure>
                                             <img {...props} className="!relative w-full" />
                                             <figcaption className="text-center text-sm text-muted">{props.title}</figcaption>
                                        </figure>
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