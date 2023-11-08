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
    where: {
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
    take: limit,
    skip: page * limit,
    orderBy: {
      posts: {
        _count: "desc",
      },
    },
    include: {
      _count: { select: { posts: true, followingtag: true } },
    },
  });

  return { tags: JSON.parse(JSON.stringify(tags)) };
}