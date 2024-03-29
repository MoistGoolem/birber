import clerkClient from "@clerk/clerk-sdk-node";
import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";
import { filterUserForClient } from "~/server/helpers/filterUserForClient";
import type { Post } from "@prisma/client";


const addUserDataToPosts = async (posts: Post[]) => {
    const userId = posts.map((post) => post.authorId);
    
    const users = (
        await clerkClient.users.getUserList({
            userId: userId,
            limit: 100,
        })
    ).map(filterUserForClient);

    return posts.map((post) => {
        const author = users.find((user) => user.id === post.authorId);

        if(!author || !author.username) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Author for post not found",
            });
        }

        return {
            post,
            author: {
                ...author,
                username: author.username
            }
        };
    });
}

// Create a new ratelimiter, that allows 5 requests per 1 minute
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */ 
  prefix: "@upstash/ratelimit",
});

export const postsRouter = createTRPCRouter({
    getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
        const post = await ctx.prisma.post.findUnique({
            where: {
                id: input.id,
            },
        });
        if (!post) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Post not found",
            });
        }
        return (await addUserDataToPosts([post]))[0];           
    }),
    getAll: publicProcedure.query(async ({ ctx }) => {
        const posts = await ctx.prisma.post.findMany({
            take: 100,
            orderBy: [
                { createdAt: "desc" }
            ],
        });
        return addUserDataToPosts(posts);
    }),
    getPostsByUserId: publicProcedure
        .input(
            z.object({
                userId: z.string(),
            })
        )
        .query(({ctx, input}) => 
            ctx.prisma.post.findMany({
                where: {
                    authorId: input.userId
                },
                take: 100,
                orderBy: [{ createdAt: "desc" }]
            })
            .then(addUserDataToPosts),
        ),
    create: privateProcedure
        .input(
            z.object({
                //content: z.string().emoji("Not an emoji").min(1, "Birb must contain at least 1 character").max(1000, "Birb must not contain more than 1000 characters"),
                content: z.string().min(1, "Birb must contain at least 1 character").max(1000, "Birb must not contain more than 1000 characters"),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const authorId = ctx.userId;

            const { success } = await ratelimit.limit(authorId);

            if (!success) {
                throw new TRPCError({
                    code: "TOO_MANY_REQUESTS",
                    message: "You are posting too fast!",
                });
            }

            const post = await ctx.prisma.post.create({
                data: {
                    authorId,
                    content: input.content,
                },
            });
            return post;
        }),
});
