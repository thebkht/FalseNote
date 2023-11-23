import { config } from '@/app/auth';
import { PostEditorForm as Editor } from '@/components/editor/post-editor-form'
import { getSessionUser } from '@/components/get-session-user';
import postgres from '@/lib/postgres';
import { Post, User } from '@prisma/client';
import { notFound, redirect } from 'next/navigation';

async function getPostForUser(postId: Post['id']) {
  // check if post draft exists of post
  const post =  await postgres.post.findFirst({
    where: {
      id: postId,
    },
    include: {
      tags: {
        include: {
          tag: true,
        },
      }
      },
  })

  if (!post) {
    return null
  }
  const draft = await postgres.draftPost.findFirst({
    where: {
      postId: post?.id,
    },
  })

  if (draft) {
    post.content = draft.content
    post.title = draft.title
    post.subtitle = draft.subtitle
    post.cover = draft.cover
    post.readingTime = draft.readingTime
  }

  return post
}

export default async function PostEditor({ params }: { params: { id: string } }) {
  const session = await getSessionUser();

  if (!session) {
    redirect('/signin')
  }

  const post = await getPostForUser(params.id)

  if (!post) {
    return notFound()
  }

  return (
    
    <main className="flex min-h-screen flex-col items-center justify-between px-6 py-14 lg:p-20 editor">
     <Editor post={post} user={session} />
    </main>
  )
}
