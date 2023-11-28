"use server";
import { Post, PostShare } from "@prisma/client";
import postgres from "../postgres";

export const addShare = async (postId: PostShare["postId"]) => {
  if (!postId) return;
  try {
    await postgres.postShare.create({
      data: {
        postId,
      },
    });
  } catch (error) {
    console.log(error);
  }
};