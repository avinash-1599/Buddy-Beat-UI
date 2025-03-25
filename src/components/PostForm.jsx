import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addNewPost } from "../utils/postSlice";
import { MdPhotoCamera } from "react-icons/md";

// eslint-disable-next-line react/prop-types
const PostForm = ({ setPreviewMedia, setPostContent }) => {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let uploadedMediaUrl = null;

    if (media) {
      uploadedMediaUrl = await uploadMediaToS3();
      if (!uploadedMediaUrl) {
        setError("Failed to upload media. Please try again.");
        return;
      }
    }

    try {
      const { data } = await axios.post(
        BASE_URL + "/post/create",
        { content, media: uploadedMediaUrl },
        { withCredentials: true }
      );

      dispatch(addNewPost(data.data));

      setContent("");
      setMedia(null);
      setPreviewUrl(null);
      setPreviewMedia(null); // Reset Preview
      setPostContent(""); // Reset Preview Content
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
      setMedia(null);
      setPreviewUrl(null);
      return;
    }

    setMedia(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setPreviewMedia({ url, type: file.type }); // Update Preview Post Card
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
        headers: { "Content-Type": media.type },
      });

      return data.filePath;
    } catch (error) {
      console.error("Upload error:", error);
      setError("Failed to upload media.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex-1 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">Create a Post</h2>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
        <textarea
          placeholder="What's on your mind?"
          className="w-full h-24 p-3 border rounded-xl focus:ring focus:ring-blue-300 outline-none resize-none"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setPostContent(e.target.value); // Update Preview Post Card Content
          }}
        />

        <label className="flex items-center gap-2 cursor-pointer text-blue-500 hover:text-blue-600">
          <MdPhotoCamera className="text-2xl" />
          <span>{uploading ? "Uploading..." : "Upload Image/Video"}</span>
          <input type="file" className="hidden" onChange={handleMediaChange} />
        </label>

        {previewUrl && (
          <div className="mt-3">
            {media?.type.startsWith("image/") ? (
              <img src={previewUrl} className="w-full max-h-60 rounded-lg border" alt="Preview" />
            ) : media?.type.startsWith("video/") ? (
              <video controls className="w-full max-h-60 rounded-lg border">
                <source src={previewUrl} type={media.type} />
                Your browser does not support the video tag.
              </video>
            ) : null}
          </div>
        )}

        {error && <p className="text-red-500 text-center">{error}</p>}

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