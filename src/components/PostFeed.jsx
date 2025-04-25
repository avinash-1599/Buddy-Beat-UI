import { useDispatch, useSelector } from "react-redux";
import Post from "./Post";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { setPosts } from "../utils/postSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FriendRecommendations from "./FriendRecommendations";
import SideBar from "./SideBar";

const PostFeed = () => {
    const postFeed = useSelector((store) => store.post);
    const posts = postFeed?.posts || [];
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showTooltip, setShowTooltip] = useState(false);
    const user = useSelector((store) => store.user);

    const getPostFeed = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/post/feed`, { withCredentials: true });
            console.log("Post feed response:", res.data);

            if (Array.isArray(res.data.posts)) {
                dispatch(setPosts(res.data.posts));
            } else {
                console.error("Invalid response format:", res.data);
            }
        } catch (err) {
            console.error("Error fetching posts:", err);
        }
    };

    useEffect(() => {
        if (!user?._id) return;
        getPostFeed();
    }, [user]);

    if (!posts?.length) {
        return (
            <div className="flex px-8 lg:px-8">
                {/* Left - Sidebar */}
                <div className="hidden lg:block w-2/12">
                    <SideBar />
                </div>
    
                {/* Center - Main Content */}
                <div className="w-full lg:w-7/12 pt-4 px-4">
                    <div className="flex flex-col items-center p-8 bg-gray-900 text-white rounded-xl shadow-lg">
                        <div className="flex items-center justify-between w-full border-b border-gray-700 pb-4 mb-6">
                            <h2 className="text-3xl font-semibold text-white">📢 Latest Posts</h2>
                            <button
                                className="flex items-center gap-2 px-2 py-1 text-black bg-white rounded-lg shadow hover:bg-yellow-400 transition-all"
                                onClick={() => navigate("/create-post")}
                            >
                                <img src="/create-post-icon.png" alt="Create post" className="h-6 w-6" />
                                <span>Create Post</span>
                            </button>
                        </div>
                        <p className="text-gray-400 text-lg text-center">
                            No posts available. Be the first to share something!
                        </p>
                    </div>
                </div>
    
                {/* Right - Friend Recommendations */}
                <div className="hidden lg:block w-3/12">
                    <FriendRecommendations />
                </div>
            </div>
        );
    }

    return (
        <div className="flex my-10 w-full gap-4 h-[100vh]">
            
            {/* Left - Sidebar */}
            <div className="hidden lg:block w-2/12">
                <SideBar />
            </div>

            {/* Center - Post Feed */}
            <div className="w-full lg:w-7/12 overflow-y-auto mt-5 relative">
                <div className="p-6 bg-gray-900 text-white rounded-lg shadow-lg">
                    <div className="flex items-center justify-between border-b border-gray-700 pb-4 mb-6 relative">
                        <h2 className="text-2xl font-extrabold text-white">📢 Latest Posts</h2>
                        <div
                            className="relative flex items-center"
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                        >
                            <img
                                src="/create-post-icon.png"
                                alt="Create post"
                                className="h-10 w-10 cursor-pointer bg-white p-1 border border-black rounded-full hover:shadow-md transition-transform transform hover:scale-110"
                                onClick={() => navigate("/create-post")}
                            />
                            {showTooltip && (
                            <span className="absolute right-full mr-2 bg-black text-white text-sm px-3 py-1 rounded-md whitespace-nowrap z-50 shadow-lg top-1/2 -translate-y-1/2">
                                Create a new post
                            </span>
                            )}
                        </div>
                    </div>
                    <div className="space-y-6 w-full max-w-3xl mx-auto">
                        {posts.map((post) => (
                            <Post key={post._id} post={post} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Right - Friend Recommendations */}
            <div className="w-3/12 min-h-screen">
            <FriendRecommendations />
            </div>
        </div>
    );
};

export default PostFeed;