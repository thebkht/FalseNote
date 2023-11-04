import { config } from '@/app/auth';
import { PostEditorForm } from '@/components/editor/post-editor-form'
import { getSessionUser } from '@/components/get-session-user';
import postgres from '@/lib/postgres';
import { Post, User } from '@prisma/client';
import { notFound, redirect } from 'next/navigation';

async function getPostForUser(postUrl: Post['url'], userId: User["id"]) {
  return await postgres.post.findFirst({
    where: {
      url: postUrl,
      authorId: userId,
    },
    include: {
      tags: {
        include: {
          tag: true,
        },
      }
      },
  })
}

export default async function PostEditor({ params }: { params: { posturl: string } }) {
  const session = await getSessionUser();

  if (!session) {
    redirect('/signin')
  }

  const post = await getPostForUser(params.posturl, session.id)

  if (!post) {
    redirect('/404')
  }

  return (
    
    <main className="flex min-h-screen flex-col items-center justify-between px-6 py-14 lg:p-20 editor">
     { post && <PostEditorForm post={post} user={session} /> }
    </main>
  )
}
