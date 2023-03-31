import { type NextPage } from "next";
import Head from "next/head";
import { LoadingSpinner } from "~/components/Loading";
import { api } from "~/utils/api";


const ProfilePage: NextPage = () => {
  const {data, isLoading} = api.profile.getUserByUsername.useQuery({
    username: "moistgoolem",
  });

  if(isLoading) return <LoadingSpinner />;

  if(!data) return <div>404</div>;
  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <main className="flex justify-center h-screen">
        <div>
          {data.username}
        </div>
      </main>
    </>
  );
};

export default ProfilePage;
