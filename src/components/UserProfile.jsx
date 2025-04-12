import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Media Posts");
  const [editingBio, setEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState("");
  const [savingBio, setSavingBio] = useState(false);

  const dispatch = useDispatch();

  const loggedInUser = useSelector((store) => store.user);
  const loggedInUserId = loggedInUser?._id;

  const fetchUser = async () => {
    try {
      const result = await axios.get(`${BASE_URL}/user/${userId}`, {
        withCredentials: true,
      });
      setUser(result.data.data);
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const result = await axios.get(`${BASE_URL}/posts/${userId}`, {
        withCredentials: true,
      });
      setPosts(result.data.data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, [userId]);

  const renderContent = () => {
    const mediaPosts = posts.filter((post) => post.media);
    const textPosts = posts.filter((post) => !post.media);

    const toRender = activeTab === "Media Posts" ? mediaPosts : textPosts;

    if (toRender.length === 0) {
      return (
        <p className="text-center text-gray-500 mt-10">No posts available.</p>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {toRender.map((post) => (
          <div
            key={post._id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300"
          >
            {post.media && (
              <img
                src={post.media}
                alt="Post"
                className="w-full h-60 object-cover transition-transform duration-300 hover:scale-105"
              />
            )}
            <div className="p-4">
              <p className="text-gray-800 text-sm">{post.content}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const handleSaveBio = async () => {
    try {
      setSavingBio(true);
      await axios.patch(`${BASE_URL}/profile/edit`, { about: bioInput }, { withCredentials: true });
      //setUser((prev) => ({ ...prev, about: res.data.data.about }));

      await fetchUser(); // Refresh user data

      dispatch(addUser({ ...user, about: bioInput })); // Update Redux store

      setEditingBio(false);
    } catch (err) {
      alert("Failed to update bio: ", err.response?.data?.message || "Unknown error");
    } finally {
      setSavingBio(false);
    }
  };
  

  if (loading) return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  if (!user) return <div className="text-center mt-10 text-red-500">User not found</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Profile section */}
      <div className="bg-gray-400 shadow-lg rounded-2xl flex flex-col md:flex-row items-center md:items-start p-6 mb-10">
        <img
          src={user.photoUrl}
          alt={user.fullName}
          className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500 shadow-lg"
        />
        <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left w-full">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h2 className="text-2xl font-semibold text-gray-800">
              {user.firstName} {user.lastName}
            </h2>
            {!editingBio ? (
               user._id === loggedInUserId &&
                (<button
                className="text-sm bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700 transition"
                onClick={() => {
                  setEditingBio(true);
                  setBioInput(user.about || "");
                }}
              >
                Update Bio
              </button>)
            ) : (
              <div className="flex gap-2">
                <button
                  className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition disabled:opacity-50"
                  onClick={handleSaveBio}
                  disabled={savingBio}
                >
                  {savingBio ? "Saving..." : "Save"}
                </button>
                <button
                  className="text-sm bg-gray-300 px-3 py-1 rounded hover:bg-gray-400 transition"
                  onClick={() => setEditingBio(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 text-gray-700 text-sm space-y-1">
            {editingBio ? (
              <textarea
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                rows={3}
              />
            ) : (
                <p className="whitespace-pre-line">{user.about || "No bio added yet."}</p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-around border-b">
        {["Media Posts", "Posts"].map((tab) => (
          <button
            key={tab}
            className={`py-2 px-4 font-medium capitalize ${
              activeTab === tab ? "border-b-2 border-black text-white" : "text-gray-500"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[300px]">
        {renderContent()}
      </div>
    </div>
  );
};

export default UserProfile;