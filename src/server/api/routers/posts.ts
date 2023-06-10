import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        where: z
          .object({
            user: z
              .object({
                id: z.string().optional(),
              })
              .optional(),
          })
          .optional(),
        cursor: z.string().nullish(),
        limit: z.number().min(1).max(100).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id;
      const { limit, cursor, where } = input;
      // await ctx.prisma.user.deleteMany();
      // await ctx.prisma.post.deleteMany();
      const posts = await ctx.prisma.post.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where,
        cursor: cursor ? { id: cursor } : undefined,
        take: limit + 1,
        include: {
          user: true,
          comments: {
            orderBy: {
              createdAt: "desc",
            },
            include: {
              user: {
                select: {
                  bio: true,
                  name: true,
                  id: true,
                  image: true,
                  createdAt: true,
                },
              },
            },
          },
          likes: {
            where: {
              userId,
            },
            select: {
              userId: true,
            },
          },
          _count: {
            select: {
              likes: true,
            },
          },
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (posts.length > limit) {
        const nextItem = posts.pop() as (typeof posts)[number];

        nextCursor = nextItem.id;
      }
      return {
        posts,
        nextCursor,
      };
    }),

  getSinglePost: publicProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.post.findUnique({
        where: {
          id: input.postId,
        },
      });
    }),

  createPost: protectedProcedure
    .input(z.object({ content: z.string(), image: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.post.create({
        data: {
          content: input.content,
          image: input.image,
          userId: ctx.session.user.id,
        },
      });
    }),

  deletePost: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: {
          id: input.id,
        },
      });

      if (post?.userId !== ctx.session.user.id) {
        throw new Error("You are not autorized to delete this post");
      }

      return await ctx.prisma.post.delete({
        where: {
          id: input.id,
        },
      });
    }),

  newComment: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        image: z.string().optional(),
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const newComm = await ctx.prisma.comment.create({
        data: {
          content: input.content,
          image: input.image ? input.image : "",
          userId: ctx.session.user.id,
          postId: input.postId,
        },
      });

      return newComm;
    }),

  // toggleLike: protectedProcedure
  //   .input(z.object({ id: z.string() }))
  //   .mutation(async ({ ctx, input }) => {
  //     const data = { postId: input.id, userId: ctx.session.user.id };

  //     const existingLike = await ctx.prisma.like.findUnique({
  //       where: {
  //         userId_postId: data,
  //       },
  //     });

  //     if (existingLike == null) {
  //       await ctx.prisma.like.create({ data });
  //       return { addLike: true };
  //     }

  //     await ctx.prisma.like.delete({ where: { userId_postId: data } });
  //     return { addLike: false };
  //   }),

  like: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      return ctx.prisma.like.create({
        data: {
          post: {
            connect: {
              id: input.postId,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
    }),

  unlike: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      return ctx.prisma.like.delete({
        where: {
          postId_userId: {
            postId: input.postId,
            userId,
          },
        },
      });
    }),
});
