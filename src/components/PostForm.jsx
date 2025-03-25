import { useState } from "react";
import { useDispatch } from "react-redux";
import { addNewPost } from "../utils/postSlice";
import { MdPhotoCamera } from "react-icons/md";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const PostForm = () => {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Upload media first (if exists)
    let uploadedMediaUrl = null;

    if (media) {
      uploadedMediaUrl = await uploadMediaToS3();
      if (!uploadedMediaUrl) {
          setError("Failed to upload media. Please try again.");
          return;
      }
  }
    // Send post data to backend
    try {
        const { data } = await axios.post(
            BASE_URL + "/post/create",
            { content, media: uploadedMediaUrl }, // Use uploadedMediaUrl, not raw file
            { withCredentials: true }
        );

        console.log(data, "postData");
        dispatch(addNewPost(data.data));

        setContent("");
        setMedia(null);
        navigate("/post/feed");
    } catch (err) {
        console.error("Post creation error:", err);
        setError("Failed to create post.");
    }
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setError("No file selected.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Media size should not be greater than 10MB.");
      setMedia(null); // Reset the media file
      return;
    }
    setMedia(file);
    setError("");
  };

  const uploadMediaToS3 = async () => {

    if (!media) return null;

    setUploading(true);

    try {
        const { data } = await axios.get(`${BASE_URL}/get-presigned-url`, {
            params: { fileName: media.name, fileType: media.type },
        });

        await axios.put(data.uploadUrl, media, {
            headers: { "Content-Type": media.type }, // Ensures correct MIME type
        });

        return data.filePath; // S3 URL
    } catch (error) {
        console.error("Upload error:", error);
        setError("Failed to upload media.");
        return null;
    } finally {
        setUploading(false);
    }
};


  return (
    <div className="w-full max-w-7xl bg-gray-300 shadow-lg rounded-2xl p-6 mx-auto">
      {/* Header (Reduced Margin) */}
      <h2 className="text-xl font-semibold text-gray-800 text-center mb-2">
        Create a Post
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
        {/* Textarea Input */}
        <textarea
          placeholder="What's on your mind?"
          className="w-full h-24 p-3 border rounded-xl focus:ring focus:ring-blue-300 outline-none resize-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* File Upload */}
        <label className="flex items-center gap-2 cursor-pointer text-blue-500 hover:text-blue-600">
          <MdPhotoCamera className="text-2xl" />
          <span onClick={uploadMediaToS3} disabled={uploading || !media}>{uploading ? "Uploading..." : "Upload Image/Video"}</span>
          <input
            type="file"
            className="hidden"
            onChange={handleMediaChange}
          />
        </label>

        {/* Preview Selected Media */}
        {media && <img src={URL.createObjectURL(media)} alt="post media" className="w-20 h-20 mt-3" />}

        {/* Error Message */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition"
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default PostForm;
