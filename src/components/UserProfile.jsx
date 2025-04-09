import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const result = await axios.get(BASE_URL + `/posts/${userId}`, { withCredentials: true });
      setPosts(result.data.data);
    } catch (error) {
      console.error("Failed to fetch user posts:", error);
    }
  };

  const fetchUser = async () => {
    try {
      const result = await axios.get(BASE_URL + `/user/${userId}`, { withCredentials: true });
      setUser(result.data.data);
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, [userId]);

  if (loading) return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  if (!user) return <div className="text-center mt-10 text-red-500">User not found</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Profile section */}
      <div className="bg-white shadow-lg rounded-2xl flex flex-col md:flex-row items-center md:items-start p-6 mb-10">
        <img
          src={user.photoUrl}
          alt={user.fullName}
          className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500 shadow-lg"
        />
        <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
          <h2 className="text-2xl font-semibold text-gray-800">{user.firstName} {user.lastName}</h2>
          <p className="text-sm text-gray-500">{user.description}</p>

          <div className="mt-4 text-gray-700 text-sm space-y-1">
            <p><span className="font-medium">Email:</span> {user.emailId}</p>
            <p><span className="font-medium">Age:</span> {user.age || "Not specified"}</p>
            {user.about && <p><span className="font-medium">About:</span> {user.about}</p>}
          </div>
        </div>
      </div>

      {/* Posts section */}
      <div className="relative flex items-center mb-6">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-gray-600 font-medium text-sm tracking-wide">Posts</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300"
            >
              {post.media ? post.media && (
                <img
                  src={post.media}
                  alt="Post"
                  className="w-full h-60 object-cover transition-transform duration-300 hover:scale-105"
                />
              ) : 
              <img
              src="/no-post-content.jpg"
              alt="Post"
              className="w-full h-60 object-cover transition-transform duration-300 hover:scale-105"
            />}
              <div className="p-4">
                <p className="text-gray-800 text-sm">{post.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
