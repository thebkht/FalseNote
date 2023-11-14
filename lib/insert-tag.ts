import postgres from "./postgres";

function sanitizeTagName(tag: string): string {
  //if tag is "hello world" it will be "hello-world" if 'hello world ' it will be 'hello-world' not 'hello-world-'
  return tag.replace(/\s+/g, "-").toLowerCase().toString();
}

export async function insertTag(tags: any, postid: any) {
  if (tags) {
    const uniqueTags = new Set<string>(
      tags.map((tag: any) => sanitizeTagName(tag.value))
    );
    for (const tag of uniqueTags) {
      const tagExists = await postgres.tag.findFirst({
        where: { name: tag },
        select: { id: true },
      });
      if (!tagExists) {
        const tagId = await postgres.tag.create({
          data: { name: tag },
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
  //first check if tag is already connected to post
  const tagAlreadyConnected = await postgres.postTag.findFirst({
    where: {
      tagId: tagId,
      postId: Number(postid),
    },
    select: {
      id: true,
    },
  });
  if (tagAlreadyConnected) {
    return;
  } else {
    await postgres.postTag.create({
      data: {
        tagId: tagId,
        postId: Number(postid),
      },
    });
  }
}
