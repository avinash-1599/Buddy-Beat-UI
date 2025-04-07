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
        const result = await axios.get(BASE_URL + `/posts/${userId}`, {withCredentials: true});
        console.log("User posts123:", result.data);
        setPosts(result.data.data);
    } catch (error) {
        console.error("Failed to fetch user posts:", error);
    }
  };

  const fetchUser = async () => {
    try {
      const result = await axios.get(BASE_URL + `/user/${userId}`, {withCredentials: true});
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
    <div className="w-[900px] h-[800px] overflow-y-auto bg-gray-500 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/3 bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white flex flex-col items-center justify-center">
          <img
            src={user.photoUrl}
            alt={user.fullName}
            className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover"
          />
          <h2 className="mt-4 text-2xl font-semibold">{user.firstName+" "+user.lastName}</h2>
          <p className="text-sm opacity-80 mt-1">{user.description}</p>
        </div>
        <div className="md:w-2/3 p-6 space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">About</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{user.about}</p>

          {/* Add more fields if needed */}
          <div className="mt-6">
            <h4 className="text-md font-medium text-gray-700">Email</h4>
            <p className="text-sm text-gray-600">{user.emailId}</p>
          </div>

          <div>
            <h4 className="text-md font-medium text-gray-700">Age</h4>
            <p className="text-sm text-gray-600">{user.age || "Not specified"}</p>
          </div>
        </div>
      </div>
      <div className="user-posts">
      <div className="relative flex items-center my-8">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-black font-medium text-sm tracking-wide">
            User Posts
        </span>
        <div className="flex-grow border-t border-gray-300"></div>
        </div>
        {posts.length === 0 ? (
          <p className="text-gray-500">No posts available.</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="bg-white shadow-md rounded-lg p-4 mb-4">
              <p className="text-black">{post.content}</p>
              { post.media && <img src={post.media} alt="Post" className="w-[300px] h-[300px] mt-2 rounded-lg" />}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserProfile;