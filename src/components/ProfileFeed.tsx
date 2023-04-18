import { api } from "~/utils/api";
import { LoadingPage } from "./Loading";
import { PostView } from "./PostView";


export const ProfileFeed = (props: {userId: string}) => {
    const {data, isLoading} = api.posts.getPostsByUserId.useQuery({
        userId: props.userId
    });

    if(isLoading) return <LoadingPage />;

    if(!data || data.length === 0) return <div>User has no posted any Birbs</div>;

    return (
        <div className="flex flex-col">
            {data.map((fullPost) => (
                <PostView {...fullPost} key={fullPost.post.id}/>
            ))}
        </div>
    )
};