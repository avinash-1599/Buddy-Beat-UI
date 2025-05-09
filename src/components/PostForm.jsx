import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addNewPost } from "../utils/postSlice";
import { MdPhotoCamera } from "react-icons/md";
//import LocationTagger from "./LocationTagger";
import LocationSearch from "./LocationSearch";

// eslint-disable-next-line react/prop-types
const PostForm = ({ setPreviewMedia, setPostContent, setPostLocation, setIsLocked }) => {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLocked, setLocalIsLocked] = useState("unlocked");

  const [selectedChallengeType, setSelectedChallengeType] = useState("");
  const [challengeData, setChallengeData] = useState(null);

  const [location, setLocation] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let uploadedMediaUrl = null;

    if (!content && !media) {
      setError("Please enter some content or upload media.");
      return;
    }
    if (content.length > 500) {
      setError("Content should not exceed 500 characters.");
      return;
    }

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
        { content, 
          media: uploadedMediaUrl, 
          isLocked, 
          challengeType: selectedChallengeType, 
          challenge: challengeData,
          location: location ? location.display_name : null },
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

  const handleChallengeTypeChange = async (e) => {
    let selectedType = e.target.value;
    setSelectedChallengeType(selectedType);
  
    if (!content && (selectedType === "riddle" || selectedType === "scramble")) {
      setError("Please enter some content/caption first to generate a challenge.");
      return;
    }
  
    try {
      const { data } = await axios.post(
        BASE_URL + "/post/generate-challenge",
        { caption: content, challengeType: selectedType },
        { withCredentials: true }
      );
      setChallengeData(data.challenge);
      setError("");
    } catch (err) {
      console.error("Challenge generation error:", err);
      setError("Failed to generate challenge.");
      setChallengeData(null);
    }
  };

  const toggleLock = () => {
    const newState = isLocked === "locked" ? "unlocked" : "locked";
    setLocalIsLocked(newState);
    setIsLocked(newState); // <-- Sync with parent
  };

  return (
    <div className="flex-1 bg-gray-400 p-6 rounded-xl shadow-md mx-auto max-w-3xl">
  <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">Create a Post</h2>

  <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
    <textarea
      placeholder="What's on your mind?"
      className="w-full h-24 p-3 border border-gray-300 rounded-xl focus:ring focus:ring-blue-300 outline-none resize-none text-gray-800"
      value={content}
      onChange={(e) => {
        setContent(e.target.value);
        setPostContent(e.target.value);
      }}
    />

    <label className="flex items-center gap-2 cursor-pointer text-blue-500 hover:text-blue-600 text-sm">
      <MdPhotoCamera className="text-2xl" />
      <span>{uploading ? "Uploading..." : "Upload Image/Video"}</span>
      <input type="file" className="hidden" onChange={handleMediaChange} />
    </label>

    {/* location tagging */}
    <LocationSearch onLocationSelect={(loc) => setLocation(loc)} setPostLocation={(loc) => setPostLocation(loc)} />
    {location && (
      <p className="text-sm text-gray-600 mt-1">
        Selected Location: <span className="font-medium">{location.display_name}</span>
      </p>
    )}

    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-4">
        <label htmlFor="post-toggle" className="text-gray-700 font-medium flex items-center">
          <span className="ml-1 mr-2">Keep Post As:</span>
          <span
            className={`inline-block w-[80px] text-center font-semibold ${
              isLocked === "locked" ? "text-red-500" : "text-blue-500"
            }`}
          >
            {isLocked === "locked" ? "Locked" : "Unlocked"}
          </span>
        </label>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            id="post-toggle"
            className="sr-only peer"
            checked={isLocked === "locked"}
            onChange={toggleLock}
          />
          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer dark:bg-gray-600 peer-checked:bg-blue-500 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
        </label>
      </div>

      {isLocked === "locked" && (
        <div className="flex items-center gap-3 ml-1 mt-1">
          <p className="text-sm text-gray-700 font-medium">
            Choose the challenge type
          </p>
          <select
            className="p-1 px-2 text-sm w-fit min-w-[130px] border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            value={selectedChallengeType}
            onChange={handleChallengeTypeChange}
          >
            <option value="riddle">Riddle</option>
            <option value="scramble">Scramble</option>
            <option value="quick_maths">Quick Maths</option>
            <option value="odd_one_out">Odd One Out</option>
            <option value="guess_output">Guess Output</option>
          </select>
        </div>
      )}
    </div>

    {isLocked === "locked" && challengeData?.question && (
      <div className="mt-3 ml-1 p-3 bg-white rounded-lg shadow-sm border">
        <p className="text-sm text-gray-800 font-medium">Generated Challenge:</p>
        <p className="text-base font-semibold text-blue-700">{challengeData.question}</p>
      </div>
    )}

    {/* {previewUrl && (
      <div className="mt-3">
        {media?.type.startsWith("image/") ? (
          <img
            src={previewUrl}
            className={`w-full max-h-60 rounded-lg border transition ${
              isLocked === "locked" ? "blur-lg" : ""
            }`}
            alt="Preview"
          />
        ) : media?.type.startsWith("video/") ? (
          <video
            controls
            className={`w-full max-h-60 rounded-lg border transition ${
              isLocked === "locked" ? "blur-lg" : ""
            }`}
          >
            <source src={previewUrl} type={media.type} />
            Your browser does not support the video tag.
          </video>
        ) : null}
      </div>
    )} */}

    {error && <p className="text-red-500 text-center text-sm">{error}</p>}

    <button
      type="submit"
      className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition"
    >
      Post
    </button>
  </form>
</div>
  )
};

export default PostForm;