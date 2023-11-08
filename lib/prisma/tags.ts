import postgres from "../postgres";

export const getTags = async ({
  id,
  page = 0,
}: {
  id?: number | undefined;
  page?: number | undefined;
}) => {
  try {
    const whereClause = id !== undefined ? {
      followingtag: {
        none: {
          followerId: id,
        },
      },
    } : {};

    const tags = await postgres.tag.findMany({
      where: whereClause,
      take: 10,
      skip: page * 10,
      orderBy: {
        posts: {
          _count: "desc",
        },
      },
      include: {
        _count: { select: { posts: true, followingtag: true } },
        followingtag: true,
      },
    });

    return { tags: JSON.parse(JSON.stringify(tags)) };
  } catch (error) {
    console.error(error);
    return { error: 'An error occurred while fetching tags.' };
  }
};

//popular tags which are not followed by the user
export const getPopularTags = async ({
  id, 
  take = 5,
}: {
  id: number | undefined;
  take?: number | undefined;
}) => {
  try {
    const whereClause = id !== undefined ? {
      followingtag: {
        none: {
          followerId: id,
        },
      },
    } : {};

    const tags = await postgres.tag.findMany({
      where: whereClause,
      take: take,
      orderBy: {
        followingtag: {
          _count: "desc",
        },
      },
      include: {
        _count: { select: { posts: true, followingtag: true } },
      },
    });

    return { tags: JSON.parse(JSON.stringify(tags)) };
  } catch (error) {
    console.error(error);
    return { error: 'An error occurred while fetching tags.' };
  }
};

export const searchTags = async ({
  search,
  page = 0,
  limit = 10,
}: { search: string | undefined; page?: number; limit?: number }) => {
  const tags = await postgres.tag.findMany({
    where: search !== undefined ? {
      name: {
        contains: search.replace(/\s+/g, '-').toLowerCase(),
        mode: "insensitive",
      },
    } : {},
    take: limit,
    skip: page * limit,
    orderBy: {
      followingtag: {
        _count: "desc",
      },
    },
    include: {
      _count: { select: { posts: true, followingtag: true } },
    },
  });

  return { tags: JSON.parse(JSON.stringify(tags)) };
}

export async function getRelatedTags(tagName: string) {
  // Find all postTags that are related to the specific tag
  const postTags = await postgres.postTag.findMany({
    where: {
      tag: {
        name: tagName,
      },
    },
    select: {
      postId: true,
    }
  });

  // Find all postTags that are related to these posts
  const relatedPostTags = await postgres.postTag.findMany({
    where: {
      postId: {
        in: postTags.map((post: any) => post.postId),
      },
      NOT: {
        tag: {
          name: tagName,
        },
      },
    },
    select: {
      tag: {
        select: {
          id: true,
          name: true,
        },
      }
    },
    orderBy: {
      postId: "desc",
    },
    take: 5,
  });

  // Extract all tags from these postTags
  let relatedTags = relatedPostTags.map((postTag: any) => postTag.tag);

  // Remove duplicates
  relatedTags = relatedTags.filter((tag, index, self) =>
    index === self.findIndex(t => t.id === tag.id)
  );

  return { tags: JSON.parse(JSON.stringify(relatedTags))};
}