import { getSessionUser } from "@/components/get-session-user";
import { insertTag } from "@/lib/insert-tag";
import postgres from "@/lib/postgres";
import readingTime from "reading-time";
import { z } from "zod";

export async function PATCH(
  req: Request,
  { params }: { params: { postid: string } }
) {
  try {
    const { postid } = params;

    if (!(await verifyCurrentUserHasAccessToPost(postid))) {
      return new Response(null, { status: 403 });
    }
    const data = await req.json();

    if (!data) {
      return new Response("No data provided", { status: 400 });
    }

    const {
      title,
      content,
      coverImage,
      published,
      tags,
      url,
      authorId,
      subtitle,
    } = data;
    const stats = readingTime(content);
    const readTime = stats.text;

    if (!title) {
      return new Response("No title provided", { status: 400 });
    }
    if (!content) {
      return new Response("No content provided", { status: 400 });
    }

    const oldData = await postgres.post.findFirst({
      where: {
        id: postid,
      },
      select: {
        published: true,
      },
    });

    await postgres.post.update({
      where: {
        id: postid,
      },
      data: {
        title: title,
        content: content,
        cover: coverImage || null,
        published: published,
        url: url,
        subtitle: subtitle || null,
        readingTime: readTime,
        ...(oldData?.published === false &&
        published === true && { publishedAt: new Date() }),
      ...(oldData?.published === true &&
        published === true && { updatedAt: new Date(), updated: true }),
      },
    });

    await postgres.postTag.deleteMany({
      where: {
        postId: postid,
      },
    });

    await insertTag(tags, postid);

    return new Response(null, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }
    console.error(error);
    return new Response(null, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { postid: string } }
) {
  try {
    const { postid } = params;

    if (!(await verifyCurrentUserHasAccessToPost(postid))) {
      return new Response(null, { status: 403 });
    }

    // Disconnect all connections of the post
    await postgres.postTag.deleteMany({
      where: {
        postId: postid,
      },
    })

    await postgres.comment.deleteMany({
      where: {
        postId: postid,
      },
    })

    await postgres.like.deleteMany({
      where: {
        postId: postid,
      },
    })

    await postgres.bookmark.deleteMany({
      where: {
        postId: postid,
      },
    })

    await postgres.readingHistory.deleteMany({
      where: {
        postId: postid,
      },
    })
    await postgres.draftPost.deleteMany({
      where: {
        postId: postid,
      },
    })
    // Delete the post.
    await postgres.post.delete({
      where: {
        id: postid,
      },
    })

    return new Response(null, { status: 204 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }
    console.error(error)
    return new Response(null, { status: 500 })
  }
}

async function verifyCurrentUserHasAccessToPost(postId: string) {
  try {
    const session = await getSessionUser();
    const count = await postgres.post.count({
      where: {
        id: postId,
        authorId: session?.id,
      },
    });

    return count > 0;
  } catch (error) {
    console.error(error);
    return false;
  }
}