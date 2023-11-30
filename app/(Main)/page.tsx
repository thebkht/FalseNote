import { redirect } from 'next/navigation';
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

  // Use Promise.all to run both fetch operations in parallel
const [latestPosts, tags, popularPosts] = await Promise.all([
  postgres.post.findMany({
    where: {
      published: true,
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
      publishedAt: true,
      cover: true,
      _count: {
        select: {
         likes: true,
         savedUsers: true,
         readedUsers: true,
         shares: true,
         comments: true,
        },
      },
      author: {
        select: {
          username: true,
          name: true,
          image: true,
          verified: true,
          falsemember: true,
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
  }),
  postgres.tag.findMany({
    select: {
      name: true,
      id: true,
    },
    take: 10,
  }),
  getPosts({limit: 6})
]);

//latest post of the day
const { posts: popular } = popularPosts;

  return <Landing latest={latestPosts} tags={tags} popular={popular} />;
}
