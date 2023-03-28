import { useUser } from "@clerk/nextjs";
import Image from "next/image";

export const CreatePostWizard = () => {
    const { user } = useUser();

    if(!user) return null;

    return (
        <div className="flex gap-5 w-full">
            <Image 
                src={user.profileImageUrl}
                alt="Profile image" 
                className="w-16 h-16 rounded-full"
                width={56}
                height={56}
                blurDataURL={user.profileImageUrl}
                placeholder="blur"
            />
            <input placeholder="Write a birb™" className="bg-transparent grow outline-none"/>
        </div>
    );
};