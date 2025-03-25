import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updatePostLikes } from "../utils/postSlice";

/* eslint-disable react/prop-types */
const Post = ({ post }) => {
    const user = useSelector((store) => store.user);
    const currentUserId = user?._id;
    const [isLiked, setIsLiked] = useState(post.likes.includes(currentUserId));
    const [likeCount, setLikeCount] = useState(post.likes.length);
    const [likedUsers, setLikedUsers] = useState([]); 
    const [showLikedUsers, setShowLikedUsers] = useState(false);

    const { userId, content, media, createdAt, _id: postId } = post;
    const { firstName, lastName, photoUrl } = userId;
    const dispatch = useDispatch();

    useEffect(() => {
        setIsLiked(Array.isArray(post.likes) && post.likes.includes(currentUserId));
        setLikeCount(Array.isArray(post.likes) ? post.likes.length : 0);
        fetchLikedUsers();
    }, [post.likes]);

    const fetchLikedUsers = async () => {
        try {
            const { data } = await axios.get(`${BASE_URL}/post/likes/${postId}`, { withCredentials: true });
            console.log("Liked Users Data:", data.likedUsers); 
            setLikedUsers(data.likedUsers);
        } catch (error) {
            console.error("Error fetching liked users:", error);
        }
    };

    const handleLike = async () => {
        try {
            const { data } = await axios.post(
                `${BASE_URL}/post/like/${postId}`,
                {},
                { withCredentials: true }
            );

            setIsLiked(!isLiked);
            dispatch(updatePostLikes({ postId: post._id, likes: data.likes }));
            fetchLikedUsers();
        } catch (error) {
            console.error("Error liking post:", error);
        }
    };

    const toggleLikedUsers = () => {
        setShowLikedUsers(!showLikedUsers);
    };

    // Get most recent liked user
    const recentLiker = likedUsers.length > 0 ? likedUsers[0] : null;
    const otherCount = likedUsers.length - 1;

    return (
        <div className="w-full max-w-3xl bg-gray-400 shadow-md rounded-xl p-6 mx-auto my-4 border border-gray-300">
            {/* User Info */}
            <div className="flex items-center mb-3">
                <img src={photoUrl} className="h-12 w-12 rounded-full border border-gray-300" alt="User" />
                <div className="ml-3">
                    <p className="font-bold text-gray-800">{firstName} {lastName}</p>
                    <p className="text-xs text-gray-500">{new Date(createdAt).toLocaleString()}</p>
                </div>
            </div>

            {/* Post Content */}
            <p className="mt-3 text-gray-700 leading-relaxed whitespace-pre-wrap">{content}</p>

            {/* Media Handling */}
            {media && (
                <div className="flex justify-center mt-4">
                    {media.endsWith(".mp4") || media.endsWith(".webm") || media.endsWith(".mov") ? (
                        <video 
                            src={media} 
                            className="w-full max-w-[600px] max-h-[400px] rounded-lg border border-gray-200"
                            controls
                        />
                    ) : (
                        <img 
                            src={media} 
                            className="w-full max-w-[600px] max-h-[400px] rounded-lg border border-gray-200"
                            alt="Post Media"
                        />
                    )}
                </div>
            )}

            {/* Like & Comment Section */}
            <div className="flex items-center mt-5">
                <img
                    src={isLiked ? "/liked-icon.png" : "/like-icon.png"}
                    alt="like-icon"
                    onClick={handleLike}
                    className="h-9 w-10 cursor-pointer"
                />
                <span className="mx-2">{likeCount}</span>
                {/* <img src="/comment-icon.png" alt="comment-icon" className="h-10 w-10 mx-2" /> */}
            </div>

            {/* Liked By Section */}
            {recentLiker && (
                <p className="mt-2 text-black">
                    Liked by <b>{recentLiker.firstName} {recentLiker.lastName}</b> 
                    {otherCount > 0 && (
                        <>
                            {" "}and{" "}
                            <span 
                                className="text-black cursor-pointer"
                                onClick={toggleLikedUsers}
                            >
                                {otherCount} {otherCount === 1 ? "other" : "others"}
                            </span>
                        </>
                    )}
                </p>
            )}

            {/* Liked Users Modal */}
            {showLikedUsers && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
                    onClick={toggleLikedUsers}>
                    <div className="bg-gray-600 p-6 rounded-lg shadow-xl w-96 text-white relative animate-fadeIn"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button className="absolute top-2 right-3 text-black hover:text-white text-2xl font-bold"
                            onClick={toggleLikedUsers}>
                            ×
                        </button>

                        {/* Modal Title */}
                        <h2 className="text-black text-lg font-semibold border-b border-gray-900 pb-2 mb-4">Others who liked</h2>

                        {/* Liked Users List */}
                        <ul className="max-h-60 overflow-y-auto">
                            {likedUsers.slice(1).map((user) => ( // Exclude the first user
                                <li key={user._id} className="flex items-center gap-3 mb-3">
                                    <img 
                                        src={user.photoUrl} 
                                        className="h-10 w-10 rounded-full border border-gray-600" 
                                        alt="User" 
                                    />
                                    <span className="text-sm font-medium text-black">
                                        {user.firstName} {user.lastName}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Post;