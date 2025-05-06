import { useState } from "react";
import PostForm from "./PostForm";
import PreviewPostCard from "./PreviewPostCard";

const PostLayout = () => {
    const [previewMedia, setPreviewMedia] = useState(null);
    const [postContent, setPostContent] = useState("");
    const [isLocked, setIsLocked] = useState("unlocked");

    return (
        <div className="flex flex-col md:flex-row gap-6 justify-center items-start px-4">
        <div className="w-full max-w-xl">
            <PostForm setPreviewMedia={setPreviewMedia} setPostContent={setPostContent} setIsLocked={setIsLocked} />
        </div>

        {postContent &&
        <div className="w-full max-w-xl">
            <PreviewPostCard postContent={postContent} previewMedia={previewMedia} isLocked={isLocked} />
        </div>}
        </div>
    )
}

export default PostLayout;