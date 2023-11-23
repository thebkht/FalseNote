import type { Metadata } from 'next'
import postgres from '@/lib/postgres'
import { notFound } from 'next/navigation'

type Props = {
  params: { id: string }
  children: React.ReactNode
}

async function getPostData(id: string) {
  const post = await postgres.post.findFirst({
    where: { id },
    include: {
      tags: {
        include: {
          tag: true
        }
      },
    }
  });
  return post;
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const post = await getPostData(params.id);
    if (!post) {
      return notFound();
    }
    return {
      metadataBase: new URL(`${process.env.DOMAIN}/editor/${post.id}`),
      title: `Editing ${post.title} - FalseNotes`,
      description: `You are currently editing ${post.title}`,
      openGraph: {
        title: `Editing ${post.title} - FalseNotes`,
        description: `You are currently editing ${post.title}`,
        url: new URL(`${process.env.DOMAIN}/editor/${post.id}`),
      },
      twitter: {
        title: `Editing ${post.title} - FalseNotes`,
        description: `You are currently editing ${post.title}`,
            
      },
    }
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
