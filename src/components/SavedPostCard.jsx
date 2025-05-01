import { useNavigate } from "react-router-dom";

/* eslint-disable react/prop-types */
const SavedPostCard = ({ post }) => {
    const navigate = useNavigate();

    const { content, media, createdAt, _id: postId } = post;
    const firstName = post?.userId?.firstName || "Unknown";
    const lastName = post?.userId?.lastName || "";
    const photoUrl =
        post?.userId?.photoUrl ||
        "https://tamilnaducouncil.ac.in/wp-content/uploads/2020/04/dummy-avatar";
    const postUserId = post?.userId?._id;

    const handlePostClick = () => {
        navigate(`/post/${postId}`);  // Navigating to the post feed with the post ID
    };

    return (
        <div className="bg-gray-300 rounded-lg shadow-sm border p-4 max-w-sm w-full mx-auto" onClick={handlePostClick}>
            {/* User Info */}
            <div className="flex items-center mb-2">
                <img
                    src={photoUrl}
                    alt="User"
                    className="h-10 w-10 rounded-full cursor-pointer"
                    onClick={() => navigate(`/user/profile/${postUserId}`)}
                />
                <div className="ml-3">
                    <p
                        className="text-sm font-semibold cursor-pointer"
                        onClick={() => navigate(`/user/profile/${postUserId}`)}
                    >
                        {firstName} {lastName}
                    </p>
                    <p className="text-xs text-gray-600">
                        {new Date(createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>

            {/* Content */}
            <p className="text-sm text-gray-800 mb-2 line-clamp-3">
                {content}
            </p>

            {/* Media */}
            {media && (
                <div className="mt-2">
                    {media.endsWith(".mp4") ||
                    media.endsWith(".webm") ||
                    media.endsWith(".mov") ? (
                        <video
                            src={media}
                            className="w-full max-h-52 rounded-md border"
                            controls
                        />
                    ) : (
                        <img
                            src={media}
                            alt="Post Media"
                            className="w-full max-h-52 object-cover rounded-md border"
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default SavedPostCard;