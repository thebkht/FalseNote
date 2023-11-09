import { getSessionUser } from "@/components/get-session-user";
import postgres from "@/lib/postgres";
import { NextRequest } from "next/server";
import readingTime from "reading-time";
import { z } from "zod";

function sanitizeTagName(tag: string) {
  return tag.replace(/\s+/g, "-").toLowerCase();
}

async function insertTag(tags: any, postid: any) {
  if (tags) {
    for (const tag of tags) {
      const sanitizedTagName = sanitizeTagName(tag.value);
      const tagExists = await postgres.tag.findFirst({
        where: { name: sanitizedTagName },
        select: { id: true },
      });
      console.log(tagExists);
      if (!tagExists) {
        const tagId = await postgres.tag.create({
          data: { name: sanitizedTagName },
          select: { id: true },
        });
        await connectTagToPost(tagId.id, postid);
      } else {
        console.log("tag exists and connected to post");
        await connectTagToPost(tagExists.id, postid);
      }
    }
  }
}

async function connectTagToPost(tagId: any, postid: any) {
  await postgres.postTag.create({
    data: {
      tagId: tagId,
      postId: Number(postid),
    },
  });
}

async function verifyCurrentUserHasAccessToPost(postId: number) {
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

export async function PATCH(
  req: Request,
  { params }: { params: { postid: string } }
) {
  try {
    const { postid } = params;

    if (!(await verifyCurrentUserHasAccessToPost(parseInt(postid)))) {
      return new Response(null, { status: 403 });
    }
    const data = await req.json();

    if (!data) {
      return new Response("No data provided", { status: 400 });
    }

    const { title, content, coverImage, tags, url, subtitle } = data;
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
        id: Number(postid),
      },
      select: {
        visibility: true,
      },
    });
    await postgres.postTag.deleteMany({
      where: {
        postId: Number(postid),
      },
    });

    //check if draft is existing
    const draft = await postgres.draftPost.findFirst({
      where: {
        postId: Number(postid),
      },
      select: {
        id: true,
      },
    });

    if (draft) {
      await postgres.draftPost.update({
        where: {
          id: draft.id,
        },
        data: {
          title,
          content,
          cover: coverImage || null,
          readingTime: readTime,
          url,
          subtitle: subtitle || null,
        },
      });
    } else {
      await postgres.draftPost.create({
        data: {
          title,
          content,
          cover: coverImage || null,
          readingTime: readTime,
          url,
          subtitle: subtitle || null,
          postId: Number(postid),
        },
      });
    }

    await postgres.postTag.deleteMany({
      where: {
        postId: Number(postid),
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
