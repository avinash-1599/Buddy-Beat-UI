import { useDispatch, useSelector } from "react-redux";
import Post from "./Post";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { setPosts } from "../utils/postSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FriendRecommendations from "./FriendRecommendations";
import SideBar from "./SideBar";
import StoriesFeed from "./StoriesFeed";

const PostFeed = () => {
    const postFeed = useSelector((store) => store.post);
    const posts = postFeed?.posts || [];
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showPostTooltip, setShowPostTooltip] = useState(false);
    const [showStoryTooltip, setShowStoryTooltip] = useState(false);

    const user = useSelector((store) => store.user);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [recentPublicPosts, setRecentPublicPosts] = useState([]);

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

    const fetchRecentPublicPosts = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/post/recent-public-posts`, { withCredentials: true });

            if (Array.isArray(res.data.posts)) {
                setRecentPublicPosts(res.data.posts);
            } else {
                console.error("Invalid response format:", res.data);
            }
        } catch (err) {
            console.error("Error fetching recent public posts:", err);
        }
    }

    useEffect(() => {
        if (!user?._id) return;
        getPostFeed();
        fetchRecentPublicPosts();
    }, [user]);

    useEffect(() => {
        if (isSidebarOpen) {
          document.body.style.overflow = "hidden";
        } else {
          document.body.style.overflow = "auto";
        }
      
        return () => {
          document.body.style.overflow = "auto";
        };
      }, [isSidebarOpen]);
      

    if (!posts?.length) {
        return (
            <>
                {/* Mobile-only toggle icon */}
                <div className="lg:hidden fixed top-20 left-2 z-50">
                    <button
                        onClick={() => setIsSidebarOpen(prev => !prev)}
                        className="bg-gray-600 text-black p-3 rounded-full shadow-md"
                    >
                        <img src="/menu-icon.png" alt="Menu" className="w-4 h-4" />
                    </button>
                </div>
    
                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                <div className="lg:hidden fixed inset-0 bg-black bg-opacity-60 z-40 flex top-8">
                    <div className="w-1/2 max-w-[200px] h-full relative z-30 mt-10">
                        <SideBar onClose={() => setIsSidebarOpen(false)} />
                    </div>
                    <div className="flex-1" onClick={() => setIsSidebarOpen(false)} />
                </div>
                )}
    
                <div className="flex flex-col lg:flex-row my-10 w-full gap-4 px-2 sm:px-4">
                    {/* Left - Sidebar */}
                    <div className="hidden lg:block w-2/12">
                        <SideBar />
                    </div>
    
                    {/* Center - Main Content */}
                    <div className="w-full lg:w-7/12 overflow-y-auto mt-5 px-4">
                        <div className="p-6 bg-gray-900 text-white rounded-lg shadow-lg">
                            <div className="flex items-center justify-between border-b border-gray-700 pb-4 mb-6">
                                <h2 className="text-3xl font-semibold text-white ml-10">📢 Latest Public Posts</h2>
                                <button
                                    className="flex items-center gap-2 px-2 py-1 text-black bg-white rounded-lg shadow hover:bg-yellow-400 transition-all"
                                    onClick={() => navigate("/create-post")}
                                >
                                    <img src="/create-post-icon.png" alt="Create post" className="h-6 w-6" />
                                    <span>Create Post</span>
                                </button>
                            </div>
    
                            <p className="mb-4 text-md text-gray-500">
                                👋 Looks like you are just getting started. Follow users or create a post to kick off your experience. Here is what others are sharing publicly!
                            </p>
    
                            <div className="space-y-6 w-full max-w-3xl mx-auto overflow-hidden break-words">
                                {recentPublicPosts.map((post) => (
                                    <Post key={post._id} post={post} />
                                ))}
                            </div>
                        </div>
                    </div>
    
                    {/* Right - Friend Recommendations */}
                    <div className="hidden lg:block w-3/12">
                        <FriendRecommendations />
                    </div>
                </div>
            </>
        );
    }
    

    return (
        <>
            {/* Mobile-only toggle icon */}
            <div className="lg:hidden fixed top-20 left-2 z-50">
                    <button
                        onClick={() => setIsSidebarOpen(prev => !prev)}
                        className="bg-gray-600 text-black p-3 rounded-full shadow-md"
                    >
                        <img src="/menu-icon.png" alt="Menu" className="w-4 h-4" />
                    </button>
                </div>
    
                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                <div className="lg:hidden fixed inset-0 bg-black bg-opacity-60 z-40 flex top-8">
                    <div className="w-1/2 max-w-[200px] h-full relative z-30 mt-10 overflow-y-auto">
                        <SideBar onClose={() => setIsSidebarOpen(false)} />
                    </div>
                    <div className="flex-1" onClick={() => setIsSidebarOpen(false)} />
                </div>
                )}

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row my-10 w-full gap-4 px-2 sm:px-4">
            
            {/* Left - Sidebar */}
            <div className="hidden lg:block lg:w-2/12 order-2 lg:order-1">
            <SideBar />
            </div>

            {/* Center - Post Feed */}
            <div className="w-full lg:w-7/12 order-1 lg:order-2">
                    {/* stories feed */}
                    <div className="mb-3 mt-5">
                    <div className="p-4 bg-gray-900 text-white rounded-lg shadow-lg">
                        <div className="flex items-center justify-between ml-5 mr-3">
                            <h3 className="text-xl font-semibold text-white px-2">📸 Stories</h3>
                            <div
                            className="relative flex items-center"
                            onClick={() => navigate("/create-story")}
                            onMouseEnter={() => setShowStoryTooltip(true)}
                            onMouseLeave={() => setShowStoryTooltip(false)}
                            >
                            <img
                                src="/create-post-icon.png"
                                alt="Create story"
                                className="h-8 w-8 cursor-pointer bg-white p-1 border border-black rounded-full hover:shadow-md transition-transform transform hover:scale-110"
                            />
                            {showStoryTooltip && (
                                <span className="absolute right-full mr-2 bg-black text-white text-sm px-3 py-1 rounded-md whitespace-nowrap z-50 shadow-lg top-1/2 -translate-y-1/2">
                                Add a new story
                                </span>
                            )}
                            </div>
                        </div>

                        <StoriesFeed />
                        </div>
                    </div>
                <div className="p-6 bg-gray-900 text-white rounded-lg shadow-lg">

                    <div className="flex items-center justify-between border-b border-gray-700 pb-4 mb-6 relative">
                        <h2 className="text-xl font-semibold text-white ml-5">📢 Latest Posts</h2>
                        <div
                            className="relative flex items-center"
                            onMouseEnter={() => setShowPostTooltip(true)}
                            onMouseLeave={() => setShowPostTooltip(false)}
                        >
                            <img
                                src="/create-post-icon.png"
                                alt="Create post"
                                className="h-8 w-8 cursor-pointer bg-white p-1 border border-black rounded-full hover:shadow-md transition-transform transform hover:scale-110"
                                onClick={() => navigate("/create-post")}
                            />
                            {showPostTooltip && (
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
            <div className="hidden lg:block lg:w-3/12 order-3">
            <FriendRecommendations />
            </div>
        </div>

        </>
    );
};

export default PostFeed;