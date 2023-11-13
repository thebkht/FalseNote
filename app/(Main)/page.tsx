import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic'
import { getFollowings } from '@/lib/prisma/session';
import { fetchFollowingTags } from '@/components/get-following-tags';
import { getSessionUser } from '@/components/get-session-user';
import Landing from '@/components/landing/landing';
import postgres from '@/lib/postgres';
import { getPosts } from '@/lib/prisma/posts';

export default async function Home() {

  const session = await getSessionUser();
  const userFollowingsTags = await fetchFollowingTags({ id: session?.id })
  
  if (session) {
    if(userFollowingsTags.length === 0) {
      redirect('/get-started')
    } else if (userFollowingsTags.length > 0) {
      redirect('/feed')
    } 
  }

  //latest post of the day
  const latestPosts = await postgres.post.findMany({
    where: {
      visibility: 'public',
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      title: true,
      subtitle: true,
      url: true,
      createdAt: true,
      readingTime: true,
      cover: true,
      author: {
        select: {
          username: true,
          name: true,
          image: true,
          verified: true,
          Followers: true,
          Followings: true,
        }
      },
      tags: {
        select: {
          tag: true,
        },
        take: 1,
      },
      savedUsers: {
        select: {
          userId: true,
        }
      },
    },
    take: 10
  });

  const tags = await postgres.tag.findMany({
    select: {
      name: true,
      id: true,
    },
    take: 10,
  })

  const { posts: popularPosts } = await getPosts({limit: 6})

  return <Landing latest={latestPosts} tags={tags} popular={popularPosts} />;
}
