import type { Metadata } from 'next'
import { use } from 'react';

type Props = {
     params: { username: string }
     children: React.ReactNode
   }
 
export async function generateMetadata(
     { params }: Props
   ): Promise<Metadata> {   
    try{
      const encodedString = params.username.replace(/ /g, "%20");
       const response = await fetch(`${process.env.DOMAIN}/api/users/${encodedString}`);
       if (!response.ok) {
         throw new Error(`Error fetching user data: ${response.statusText}`);
       }
       const data = await response.json();  
        const user = data.user;
      return {
        metadataBase: new URL('https://falsenotes.vercel.app'),
        title: `${user.username} ${user?.name ? `(` + user?.name + `)` : `` } | FalseNotes`,
        description: user?.bio === null || user?.bio === "" ? `${user?.username} has ${user?.postsnum} posts. Follow their to keep up with their activity on FalseNotes.` : user?.bio,
        openGraph: {
          title: `${user.username} ${user?.name ? `(` + user?.name + `)` : `` } | FalseNotes`,
          description: user?.bio === null || user?.bio === "" ? `${user?.username} has ${user?.postsnum} posts. Follow their to keep up with their activity on FalseNotes.` : user?.bio,
          url: `${process.env.DOMAIN}/${user.username}`,
          images: [
            {
              url: `${process.env.DOMAIN}/api/users/${user.username}/og`,
              width: 1200,
              height: 630,
              alt: `${user.username} | FalseNotes`,
            }
          ],
        },
        twitter: {
          card: 'summary_large_image',
          title: `${user.username} ${user?.name ? `(` + user?.name + `)` : `` } | FalseNotes`,
          description: user?.bio === null || user?.bio === "" ? `${user?.username} has ${user?.postsnum} posts. Follow their to keep up with their activity on FalseNotes.` : user?.bio,
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
