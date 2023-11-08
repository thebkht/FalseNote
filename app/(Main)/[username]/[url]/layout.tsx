import MoreFromAuthor from '@/components/blog/more-from-author';
import RelatedPosts from '@/components/blog/related-posts';
import { getSessionUser } from '@/components/get-session-user';
import { Separator } from '@/components/ui/separator';
import postgres from '@/lib/postgres';
import type { Metadata } from 'next'

type Props = {
     params: { username: string, url: string }
     children: React.ReactNode
}

export async function generateMetadata(
     { params }: Props
): Promise<Metadata> {
     try {
          const response = await fetch(`${process.env.DOMAIN}/api/posts/${params.username}?url=${params.url}`);
          if (!response.ok) {
               throw new Error(`Error fetching post data: ${response.statusText}`);
          }
          const data = await response.json();
          const post = data;
          return {
               metadataBase: new URL(`${process.env.DOMAIN}/${post.author.username}/${post.url}`),
               title: `${post.title} | FalseNotes`,
               description: post.subtitle,
               openGraph: {
                    title: `${post.title} | FalseNotes`,
                    description: post.subtitle,
                    url: `${process.env.DOMAIN}/${post.author.username}/${post.url}`,
                    images: [
                         {
                              url: `${process.env.DOMAIN}/api/posts/${post.author.username}/opengraph-image?url=${post.url}`,
                              width: 1200,
                              height: 630,
                              alt: `${post.title} | FalseNotes`,
                         }
                    ],
               },
               twitter: {
                    card: 'summary_large_image',
                    title: `${post.title} | FalseNotes`,
                    description: post.subtitle,
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

export default async function PostLayout(
     { children, params }: Props
) {
     const author = await postgres.user.findFirst({
          where: {
               username: params.username
          },
          include: {
               posts: {
                    where: {
                         url: {
                              not: params.url
                         },
                         visibility: "public",
                    },
                    include: {
                         _count: { select: { comments: true, savedUsers: true, likes: true } },
                         author: {
                              include: {
                                   Followers: true,
                                   Followings: true
                              }
                         },
                         savedUsers: true,
                    },
                    orderBy: {
                         createdAt: "desc"
                    },
                    take: 4
               },
               _count: { select: { posts: true, Followers: true, Followings: true } },
               Followers: true,
               Followings: true
          }
     });

     const authorPosts = author?.posts;
     const post = await postgres.post.findFirst({
          where: {
               url: params.url,
               authorId: author?.id
          },
          include: {
               comments: {
                    include: {
                         author: {
                              include: {
                                   Followers: true,
                                   Followings: true
                              }
                         }
                    },
                    orderBy: {
                         createdAt: "desc"
                    }
               },
               likes: true,
               tags: {
                    include: {
                         tag: true
                    }
               },
               readedUsers: true,
               author: {
                    include: {
                         Followers: true,
                         Followings: true
                    }
               },
               savedUsers: true,
               _count: { select: { savedUsers: true, likes: true, comments: true } }
          }
     });
     const relatedPosts = await postgres.post.findMany({
          where: {
               tags: {
                    some: {
                         tag: {
                              name: {
                                   in: post?.tags.map((tag: any) => tag.tag.name)
                              }
                         }
                    }
               },
               url: {
                    not: post?.url
               },
               visibility: "public",
          },
          include: {
               _count: { select: { comments: true, savedUsers: true, likes: true } },
               author: {
                    include: {
                         Followers: true,
                         Followings: true
                    }
               },
               savedUsers: true,
          },
          orderBy: {
               createdAt: "desc"
          },
          take: 6
     });
     const sessionUser = await getSessionUser();

     return (
          <>
               <div className='md:container mx-auto px-4'>
                    {children}
               </div>

               <div className="bg-third dark:bg-popover py-16">
                    <div className=' md:container mx-auto px-4'>
                         <MoreFromAuthor post={authorPosts} author={author} sessionUser={sessionUser} />
                         {
                              relatedPosts?.length > 0 &&
                              (
                                   <>
                                        <Separator className="mt-14 mb-8" />
                                        <RelatedPosts posts={relatedPosts} post={post} session={sessionUser} />
                                   </>
                              )

                         }
                    </div>
               </div>
          </>
     )
}
