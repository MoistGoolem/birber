import { SignInButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import { api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Feed } from "~/components/Feed";
import { CreatePostWizard } from "~/components/CreatePostWizard";

dayjs.extend(relativeTime);

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  api.posts.getAll.useQuery();  //Start fetching asap.

  if(!userLoaded) return <div />;  // Return empty div if user is not loaded yet.

  return (
    <main className="flex justify-center h-screen">
      <div className="w-full md:max-w-4xl border-x h-full border-slate-400">
        <div className="border-b border-slate-400 p-4 flex">
          { !isSignedIn && (
            <div className="flex justify-center"> 
              <SignInButton/> 
            </div>
          )}
          { isSignedIn && <CreatePostWizard/> }
        </div>
        <Feed />
      </div>
    </main>
  );
};

export default Home;
