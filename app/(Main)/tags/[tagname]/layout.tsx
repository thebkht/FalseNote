import { SiteFooter } from "@/components/footer";
import { TagNav } from "@/components/tags/nav";
import postgres from "@/lib/postgres";
import { getRelatedTags } from "@/lib/prisma/tags";
import { Metadata } from "next";

type Props = {
     params: { tagname: string }
     children: React.ReactNode
}



export async function generateMetadata(
     { params }: Props
): Promise<Metadata> {
     try {
          const tag = await postgres.tag.findFirst({
               where: {
                    name: params.tagname
               },
               include: {
                    followingtag: true,
                    _count: { select: { posts: true, followingtag: true } }
               }
          })

          let title = tag?.name
          title = title?.replace(/-/g, " ");
          title = title?.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
          return {
               metadataBase: new URL(`${process.env.DOMAIN}/tags/${params.tagname}`),
               title: `The most insightful posts about ${title} - FalseNotes`,
               description: `Read posts about ${tag?.name?.charAt(0)?.toUpperCase() ?? ''}${tag?.name?.slice(1)} on FalseNotes, the largest publishing community for young writers.`,
               openGraph: {
                    title: `The most insightful posts about ${title} - FalseNotes`,
                    description: `Read posts about ${tag?.name?.charAt(0)?.toUpperCase() ?? ''}${tag?.name?.slice(1)} on FalseNotes, the largest publishing community for young writers.`,
                    url: `${process.env.DOMAIN}/tags/${params.tagname}`,
               },
               twitter: {
                    card: 'summary',
                    title: `The most insightful posts about ${title} | FalseNotes`,
                    description: `Read posts about ${tag?.name?.charAt(0)?.toUpperCase() ?? ''}${tag?.name?.slice(1)} on FalseNotes, the largest publishing community for young writers.`,
               },
          }
     } catch (error) {
          console.error('Error:', error);
          return {
               title: `Not Found - FalseNotes`,
               description: `The page you were looking for doesn't exist.`,
               openGraph: {
                    title: `Not Found - FalseNotes`,
                    description: `The page you were looking for doesn't exist.`,

               },
               twitter: {
                    card: 'summary_large_image',
                    title: `Not Found - FalseNotes`,
                    description: `The page you were looking for doesn't exist.`,
               },
          }
     }
}

const tags = await postgres.tag.findMany({
     orderBy: {
          posts: {
               _count: 'desc'
          }
     }
});
//add href to tags
tags.forEach((tag: any) => {
     tag.href = `/tags/${tag.name}`;
}
)

export default async function TagLayout({ children, params }: Props) {
     return (
          <>
               <div className="py-10">
                    <TagNav />
                    {children}
               </div>
          </>
     )
}