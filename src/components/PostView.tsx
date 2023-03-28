import dayjs from "dayjs";
import Image from "next/image";
import type { RouterOutputs } from "~/utils/api";

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

export const PostView = (props: PostWithUser) => {
    const { post, author } = props;

    return (
      <div key={post.id} className="p-4 border-b border-slate-400 flex gap-3">
        <Image
          src={author.profileImageUrl} // This is the author's profile image.
          className="w-14 h-14 rounded-full"
          alt={`@${author.username}`}
          width={56}
          height={56}
          blurDataURL={author.profileImageUrl}
          placeholder="blur"
        />
        <div className="flex flex-col">
          <div className="flex text-slate-400 gap-2">
            <span>{`@${author.username}`}</span>
            <span className="font-bold">·</span>
            <span className="font-thin">{dayjs(post.createdAt).fromNow()}</span>
          </div>
          <span>{post.content}</span>
        </div>
      </div>
    );

}