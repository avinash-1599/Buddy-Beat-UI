import { useSelector } from "react-redux";

/* eslint-disable react/prop-types */
const PreviewPostCard = ({ postContent, postLocation, previewMedia, isLocked }) => {

    const user = useSelector((store) => store.user);
    const { firstName, lastName, photoUrl, createdAt } = user;

    return postContent && (
      <div className="flex-1 bg-gray-400 p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">Post Preview</h2>
        {/* user info */}
        <div className="flex justify-between items-center mb-3">
            <div className="flex items-center mb-3">
                <img src={photoUrl} className="h-12 w-12 rounded-full border border-gray-300" alt="User" />
                <div className="ml-3">
                    <p className="font-bold text-gray-800">{firstName} {lastName}</p>
                    {postLocation && (
                        <p className="text-xs text-gray-700">
                        <span className="font-medium">{postLocation?.display_name}</span>
                        </p>
                    )}
                </div>
        </div>
        <p className="text-xs text-gray-500">{new Date(createdAt).toLocaleString()}</p>
        </div>
        {/* Display the entered post content */}
        <p className="mt-3 text-gray-700 leading-relaxed whitespace-pre-wrap">{postContent}</p>
  
        {/* Show preview of image or video */}
        {previewMedia?.url && (
          <div className="mt-3">
            {previewMedia.type.startsWith("image/") ? (
              <img src={previewMedia.url} className={`w-full max-h-60 rounded-lg border ${
                isLocked === "locked" ? "blur-lg" : ""
              }`} alt="Preview" />
            ) : previewMedia.type.startsWith("video/") ? (
              <video controls className="w-full max-h-60 rounded-lg border">
                <source src={previewMedia.url} type={previewMedia.type} />
                Your browser does not support the video tag.
              </video>
            ) : null}
          </div>
        )}
      </div>
    );
  };

  
    export default PreviewPostCard;