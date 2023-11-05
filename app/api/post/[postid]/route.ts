import { getSessionUser } from "@/components/get-session-user";
import postgres from "@/lib/postgres";
import readingTime from "reading-time";
import { z } from "zod";

function sanitizeTagName(tag: string) {
  return tag.replace(/\s+/g, "-").toLowerCase();
}

async function insertTag(tags: any, postid: any) {
  if (tags) {
    console.log(tags);
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
          select: { id: true }
        });
        console.log(tagId);
        await connectTagToPost(tagId.id, postid);
      } else {
        console.log("tag exists and connected to post")
        await connectTagToPost(tagExists.id, postid);
      }
    } 
  }
}

async function connectTagToPost(tagId: any, postid: any) {
  console.log(tagId, postid);
  console.log("connecting tag to post");
  await postgres.postTag.create({
    data: {
      tagId: tagId,
      postId: Number(postid),
    },
  });
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

    const {
      title,
      content,
      coverImage,
      visibility,
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

    await postgres.$transaction(async (prisma) => {
      await prisma.postTag.deleteMany({
        where: {
          postId: Number(postid),
        },
      });

      await prisma.post.update({
        where: {
          id: Number(postid),
        },
        data: {
          title: title,
          content: content,
          cover: coverImage || null,
          visibility: visibility,
          url: url,
          subtitle: subtitle || null,
          readingTime: readTime,
          ...(visibility === "public" && { createdAt: new Date(), updatedAt: new Date(), updated: true }),
        },
      });

      await insertTag(tags, postid);
    });

    return new Response(null, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
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