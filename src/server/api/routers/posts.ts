import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    // await ctx.prisma.user.deleteMany();
    // await ctx.prisma.post.deleteMany();
    return ctx.prisma.post.findMany({
      orderBy: {
        // createdAt: { sort: 'asc', nulls: 'last' },
        createdAt: "desc",
      },
      include: {
        user: true,
        comments: {
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
        likes: true,
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

      console.log(newComm);
      return newComm;
    }),
});
