import { SignInButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import { api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Feed } from "~/components/Feed";
import { CreatePostWizard } from "~/components/CreatePostWizard";
import { PageLayout } from "~/components/Layout";

dayjs.extend(relativeTime);

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  api.posts.getAll.useQuery();  //Start fetching asap.

  if(!userLoaded) return <div />;  // Return empty div if user is not loaded yet.

  return (
    <PageLayout>
      <div className="border-b border-slate-600 p-4 flex">
        { !isSignedIn && (
          <div className="flex justify-center"> 
            <SignInButton /> 
          </div>
        )}
        { isSignedIn && <CreatePostWizard /> }
        <Feed />
      </div>
    </PageLayout>
  );
};

export default Home;
