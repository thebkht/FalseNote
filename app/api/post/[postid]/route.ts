import { getSessionUser } from "@/components/get-session-user";
import postgres from "@/lib/postgres";
import readingTime from "reading-time";
import { z } from "zod";

async function insertTag(tags: any, postid: any) {
  if (tags) {
    for (const tag of tags) {
      // Check if tag exists
      // if tag has a scpecial character, replace it with a dash and make it lowercase
      const tagExists = await postgres.tag.findFirst({
        where: {
          name: tag.value.replace(/\s+/g, "-").toLowerCase(),
        },
      });
      if (!tagExists) {
        const tagId = await postgres.tag.create({
          data: {
            name: tag.value.replace(/\s+/g, "-").toLowerCase(),
          },
          select: { id: true }
        });
        
        await postgres.postTag.create({
          data: {
            tagId: tagId.id,
            postId: Number(postid),
          },
        });
      }
    }
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
    const oldPost = await postgres.post.findFirst({
      where: {
        id: Number(postid),
      },
      select: {
        visibility: true,
      },
    });

    await postgres.post.update({
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
        //if the visibility was changed to public, update the published date to now and if it was changed to private, do not nothing or if it was not changed, keep the published date as it is and set the updated date to now
        ...(oldPost?.visibility === "draft" &&
          visibility === "public" && { createdAt: new Date() }),
        ...(oldPost?.visibility === "public" &&
          visibility === "public" && { updatedAt: new Date(), updated: true }),
      },
    });

    //delete all the tags of the post and add the new tags
    const postTagsData = await postgres.postTag.findMany({
      where: {
        postId: Number(postid),
      },
      select: {
        tag: {
          select: {
            name: true,
          },
        },
      },
    });
    if (postTagsData) {
      // await sql`
      //      DELETE FROM BlogPostTags WHERE BlogPostID = ${postid}
      //      `;
      await postgres.postTag.deleteMany({
        where: {
          postId: Number(postid),
        },
      });
    }
    
    await insertTag(tags, postid);

    return new Response(null, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}

async function verifyCurrentUserHasAccessToPost(postId: number) {
  const session = await getSessionUser();
  const count = await postgres.post.count({
    where: {
      id: postId,
      authorId: session?.id,
    },
  });

  return count > 0;
}
