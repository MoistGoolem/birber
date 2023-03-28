import { api } from "~/utils/api";
import { LoadingPage } from "./Loading";
import { PostView } from "./PostView";

export const Feed = () => {
    const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

    if(postsLoading) return <LoadingPage />;

    if(!data) return <div>Something went wrong</div>;

    return(
        <div className="flex flex-col">
            {[...data]?.map((fullPost) => (
                <PostView {...fullPost} key={fullPost.post.id}/>
            ))}
        </div>
  );
};