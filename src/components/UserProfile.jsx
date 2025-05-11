import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Media Posts");
  const [editingBio, setEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState("");
  const [savingBio, setSavingBio] = useState(false);

  const [isUserConnected, setIsUserConnected] = useState(false);
  const [requestStatus, setRequestStatus] = useState("not_sent");

  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const checkIfUsersConnected = async () => {
    try {
      const result = await axios.get(`${BASE_URL}/user/is-connected/${user?._id}`, {
        withCredentials: true,
      });
      if(result.data.isConnected) {
        setIsUserConnected(result.data.isConnected);
      }
    } catch (error) {
      console.error("Failed to check connection:", error);
      return false;
    }
  }

  const fetchConnectionStatus = async () => {
    try {
      const result = await axios.get(`${BASE_URL}/request/status/${user._id}`, {
        withCredentials: true,
      });
  
      const status = result.data.status;
      setRequestStatus(status);
  
      if (status === "accepted") {
        setIsUserConnected(true);
      }
    } catch (error) {
      console.error("Failed to fetch connection status", error);
    }
  };  

  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, [userId]);

  useEffect(() => {
    if (user?._id && user._id !== loggedInUserId) {
      checkIfUsersConnected();
      fetchConnectionStatus();
    }
  }, [user, loggedInUserId]);

  const renderContent = () => {
    const mediaPosts = posts.filter((post) => post.media);
    const textPosts = posts.filter((post) => !post.media);

    const toRender = activeTab === "Media Posts" ? mediaPosts : textPosts;

    if (toRender.length === 0) {
      return (
        <p className="text-center text-gray-500 mt-10">No posts available.</p>
      );
    }

    const handlePostClick = (postId) => {
      navigate(`/post/${postId}`);  // Navigating to the post feed with the post ID
  };

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {toRender.map((post) => (
          <div
            key={post._id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300"
            onClick={() => handlePostClick(post._id)} // Handle post click
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

  const handleSendRequest = async (status, toUserId) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/request/sent/${status}/${toUserId}`,
        {},
        { withCredentials: true }
      );
  
      // Only proceed if success response is confirmed
      console.log("Request response:", res.data);
      if (res.data?.success) {
        setRequestStatus("interested");
        dispatch(removeUserFromFeed(toUserId));
      } else {
        alert(res.data?.message || "Could not send request.");
      }
    } catch (error) {
      console.error("Failed to send request:", error);
      alert(error.response?.data?.message || "Could not send request.");
    }
  };
  
  

  if (loading) return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  if (!user) return <div className="text-center mt-10 text-red-500">User not found</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10 min-h-screen">
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
            {/* Send connection request btn */}
            {user._id !== loggedInUserId && !isUserConnected && (
            ["not_sent", "ignored"].includes(requestStatus) ? (
              <button
                onClick={() => handleSendRequest("interested", user._id)}
                className="mt-5 px-2 py-1 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                Send Connection Request
              </button>
            ) : requestStatus === "interested" ? (
              <button
                disabled
                className="mt-5 px-2 py-1 text-white bg-gray-500 rounded-lg cursor-not-allowed"
              >
                Connection Request Sent
              </button>
            ) : requestStatus === "rejected" ? (
              <button
                onClick={() => handleSendRequest("interested", user._id)}
                className="mt-5 px-2 py-1 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                Re-send Connection Request
              </button>
            ) : null
          )}
        </div>
      </div>

      {/* Tabs */}
      {(!user.isAccountPrivate || user._id === loggedInUserId || isUserConnected) && <div className="flex justify-around border-b">
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
      </div>}

      {/* Content */}
      {(!user.isAccountPrivate || user._id === loggedInUserId || isUserConnected) ? <div className="min-h-[300px]">
        {renderContent()}
      </div> : <p className="text-center text-gray-300 mt-10"> This account is private. You cannot see their media.</p>}
    </div>
  );
};

export default UserProfile;