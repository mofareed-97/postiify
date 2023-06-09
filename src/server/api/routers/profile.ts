import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
  getUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.user.findFirst({
        where: {
          id: input.userId,
        },
        select: {
          bio: true,
          birthDate: true,
          country: true,
          email: true,
          name: true,
          image: true,
          website: true,
          followers: true,
          follows: true,
          Like: true,
          id: true,
          createdAt: true,
        },
      });
    }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        bio: z.string().optional(),
        website: z.string().optional(),
        birthDate: z.date().or(z.null()).optional(),
        country: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          ...input,
        },
      });
    }),
});
