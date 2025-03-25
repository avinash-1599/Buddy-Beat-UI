import { useState } from "react";
import PostForm from "./PostForm";
import PreviewPostCard from "./PreviewPostCard";

const PostLayout = () => {
    const [previewMedia, setPreviewMedia] = useState(null);
    const [postContent, setPostContent] = useState("");

    return (
        <div className="flex flex-col md:flex-row gap-6">
            <PostForm setPreviewMedia={setPreviewMedia} setPostContent={setPostContent} />
            <PreviewPostCard postContent={postContent} previewMedia={previewMedia} />
        </div>
    )
}

export default PostLayout;