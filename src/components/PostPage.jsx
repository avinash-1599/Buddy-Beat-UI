import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import Post from "./Post";

const PostPage = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/post/${postId}`, {
                    withCredentials: true,
                });
                setPost({...res.data.data.post, isSaved: res.data.data.isSaved,});
            } catch (err) {
                console.error("Error fetching post:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [postId]);

    if (loading) return <div className="text-center mt-10">Loading post...</div>;
    if (!post) return <div className="text-center mt-10 text-red-500">Post not found</div>;

    return (
        <div className="pt-12 pb-20 px-4 flex justify-center min-h-screen bg-gray-700">
            <div className="w-full max-w-4xl">
                <Post post={post} />
            </div>
        </div>
    )
};

export default PostPage;