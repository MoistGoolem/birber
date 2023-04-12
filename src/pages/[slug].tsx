import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import superjson from "superjson";

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const {data} = api.profile.getUserByUsername.useQuery({
    username,
  });

  if(!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{username}</title>
      </Head>
      <main className="flex justify-center h-screen">
        <div>
          {data.username}
        </div>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {

  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson
  });

  const slug = context.params?.slug;

  if(typeof slug !== "string") throw new Error("No Slug");

  const username = slug.replace("@", "");

  await ssg.profile.getUserByUsername.prefetch({ username});

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {
  return {paths:[], fallback: "blocking"};
};

export default ProfilePage;
