import type { Metadata } from 'next'
import { use } from 'react';

type Props = {
     params: { username: string, url: string }
     children: React.ReactNode
   }
 
export async function generateMetadata(
     { params }: Props
   ): Promise<Metadata> {   
    try{
      const response = await fetch(`${process.env.DOMAIN}/api/posts/${params.username}?url=${params.url}`);
          if (!response.ok) {
          throw new Error(`Error fetching post data: ${response.statusText}`);
          }
          const data = await response.json();
          const post = data;
          return {
            metadataBase: new URL(`${process.env.DOMAIN}/${post.author.username}/${post.url}`),
               title: `${post.title} | FalseNotes`,
               description: post.description,
               openGraph: {
                 title: `${post.title} | FalseNotes`,
                 description: post.description,
                 url: `${process.env.DOMAIN}/${post.author.username}/${post.url}`,
                 images: [
                   {
                     url: post.coverimage !== null ? post.coverimage : `${process.env.DOMAIN}/api/posts/${post.author.username}/opengraph-image?url=${post.url}`,
                     width: 1200,
                     height: 630,
                     alt: `${post.title} | FalseNotes`,
                   }
                 ],
               },
               twitter: {
                 card: 'summary_large_image',
                 title: `${post.title} | FalseNotes`,
                 description: post.description,
               },
    } 
    } catch (error) {
      console.error('Error:', error);
      return {
        title: `Not Found | FalseNotes`,
        description: `The page you were looking for doesn't exist.`,
        openGraph: {
          title: `Not Found | FalseNotes`,
          description: `The page you were looking for doesn't exist.`,

        },
        twitter: {
          card: 'summary_large_image',
          title: `Not Found | FalseNotes`,
          description: `The page you were looking for doesn't exist.`,
        },
    } 
    }
   }

export default function UserLayout(
     { children, params }: Props
  ) {

  return children
}
