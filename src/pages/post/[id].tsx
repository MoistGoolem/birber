import { type NextPage } from "next";
import Head from "next/head";
import type { GetStaticProps } from "next";
import { api } from "~/utils/api";
import { PageLayout } from "~/components/Layout";
import { generateSSgHelper } from "~/server/helpers/ssgHelper";
import { PostView } from "~/components/PostView";

const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.posts.getById.useQuery({
    id,
  });

  if(!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{`${data.post.content} - ${data.author.username}`}</title>
      </Head>
      <PageLayout>
        <PostView { ...data } />
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSgHelper();

  const id = context.params?.id;

  if(typeof id !== "string") throw new Error("No id provided");

  await ssg.posts.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths:[], fallback: "blocking" };
}; 

export default SinglePostPage;
