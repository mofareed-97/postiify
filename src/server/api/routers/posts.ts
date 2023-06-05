import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany();
  }),

  createPost: protectedProcedure
    .input(z.object({ content: z.string(), image: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.prisma.post.create({
        data: {
          content: input.content,
          image: input.image,
          userId: ctx.session.user.id,
        },
      });

      console.log(data);
    }),
});
