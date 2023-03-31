import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import { LoadingSpinner } from "./Loading";

export const CreatePostWizard = () => {
    const { user } = useUser();
    const [input, setInput] = useState("");
    const ctx = api.useContext();

    const toastStyle = {
        style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
        }
    };

    const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
        onSuccess: () => {
            setInput("");
            void ctx.posts.getAll.invalidate();
            
        },
        onError: (err) => {
            const errorMessage = err.data?.zodError?.fieldErrors.content;
            if(errorMessage && errorMessage[0]) {
                toast.error(
                    errorMessage[0],
                    toastStyle
                );
            } else {
                toast.error(
                    "Something went wrong. Please try again later.",
                    toastStyle
                );
            }
        },
    });

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
            <input 
                placeholder="Write a birb™" 
                className="bg-transparent grow outline-none"
                type={"text"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                    if(e.key ==="Enter") {
                        e.preventDefault();
                        if(input !== "") {
                            mutate({ content: input });
                        }
                    }
                }}
                disabled={isPosting}
            />
            {input !== "" && !isPosting && (
                <button onClick={() => mutate({ content: input })}> 
                    Post 
                </button>
            )}
            {isPosting && (
                <div className="flex justify-center items-center">
                    <LoadingSpinner size={25}/>
                </div>
            )}
        </div>
    );
};