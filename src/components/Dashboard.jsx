import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import SavedPostCard from "./SavedPostCard";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";


const Dashboard = () => {
  const [counts, setCounts] = useState({
    totalPosts: 0,
    totalLockedPosts: 0,
    totalStories: 0,
    totalConnections: 0,
    totalRequests: 0,
    totalBlockedUsers: 0,
  });

  const [maxLikedPost, setMaxLikedPost] = useState({});
  const [usersWhoLikedAllPosts, setUsersWhoLikedAllPosts] = useState([]);
  const [profileVisitors, setProfileVisitors] = useState([]);
  const [showTime, setShowTime] = useState({});

  const navigate = useNavigate();

  const user = useSelector((state) => state.user);
  const isPremium = user?.isPremium || false;
  const membershipType = user?.membershipType;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const cards = [
    { title: "Total Posts", value: counts.totalPosts },
    { title: "Locked Posts", value: counts.totalLockedPosts },
    { title: "Total Stories", value: counts.totalStories },
    { title: "Connections", value: counts.totalConnections },
    { title: "Connection Requests", value: counts.totalRequests },
    { title: "Total Blocked Users", value: counts.totalBlockedUsers || 0 },
  ];

  const fetchDashboardData = async () => {
    const start = performance.now();
    try {
      const [
        countsRes,
        maxLikedPostRes,
        likedAllUsersRes,
        profileVisitorsRes
      ] = await Promise.all([
        axios.get(`${BASE_URL}/dashboard/totalCounts`, { withCredentials: true }),
        axios.get(`${BASE_URL}/dashboard/maxLikedPost`, { withCredentials: true }),
        axios.get(`${BASE_URL}/dashboard/usersWhoLikedAllPosts`, { withCredentials: true }),
        axios.get(`${BASE_URL}/dashboard/profileVisitors`, { withCredentials: true })
      ]);

      const end = performance.now();
      console.log(`Dashboard data fetched in ${Math.round(end - start)}ms`);

      countsRes.data && setCounts({
        totalPosts: countsRes.data.totalPosts || 0,
        totalLockedPosts: countsRes.data.totalLockedPosts || 0,
        totalStories: countsRes.data.totalStories || 0,
        totalConnections: countsRes.data.totalConnections || 0,
        totalRequests: countsRes.data.totalRequests || 0,
        totalBlockedUsers: countsRes.data.totalBlockedUsers || 0,
        });
        maxLikedPostRes.data && setMaxLikedPost(maxLikedPostRes.data?.post || {});
        likedAllUsersRes.data && setUsersWhoLikedAllPosts(likedAllUsersRes.data?.result || []);
        profileVisitorsRes.data && setProfileVisitors(profileVisitorsRes.data || []);
        console.log("Dashboard data loaded successfully", counts, maxLikedPost, usersWhoLikedAllPosts, profileVisitors);
    } catch (err) {
      console.error("Dashboard load failed:", err);
    }
  };

    const toggleTime = (visitorId) => {
        setShowTime((prev) => ({
          ...prev,
          [visitorId]: !prev[visitorId],  // toggle this visitor's value
        }));
    };      

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-16 px-4 pt-16 mb-12 sm:mb-0 lg:mb-0">
      <h1 className="text-2xl text-gray-200 font-bold mb-6">Dashboard</h1>
  
      {/* Stats cards (top section) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="bg-gray-400 shadow-lg rounded-2xl p-6 text-center border border-gray-200"
          >
            <h2 className="text-gray-800 text-md font-medium mb-2">{card.title}</h2>
            <div className="text-4xl font-bold text-blue-600">{card.value}</div>
          </div>
        ))}
      </div>
  
      {/* Bottom section with two side-by-side panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  
        {/* Users who liked all your posts */}
        <div className="bg-gray-400 rounded-2xl shadow-lg p-6 mb-10">
          <h2 className="text-xl text-gray-800 font-semibold mb-4">Users Who Liked All Your Posts</h2>
          <div className="max-h-80 overflow-y-auto pr-4">
          <ul className="space-y-2">
          {usersWhoLikedAllPosts.length > 0 && (
            <ul className="space-y-4">
                {usersWhoLikedAllPosts.map((user) => (
                <li
                    key={user?._id}
                    className="flex items-center gap-4 bg-gray-300 rounded-xl p-3 shadow-sm hover:shadow-md transition"
                >
                    <img
                    src={user.photoUrl}
                    alt="user-photo"
                    className="w-12 h-12 rounded-full object-cover border border-gray-300 cursor-pointer"
                    onClick={() => navigate(`/user/profile/${user._id}`)}
                    />
                    <p className="text-gray-800 font-medium cursor-pointer" onClick={() => navigate(`/user/profile/${user._id}`)}>
                    {user.firstName} {user.lastName}
                    </p>
                </li>
                ))}
            </ul>
            )}
                {/* Placeholder for no users */}
            {usersWhoLikedAllPosts.length === 0 && (
                <div className="flex items-center justify-center h-full mt-20">
                    <p className="text-black text-md">No users found</p>
                </div>
            )}
          </ul>
          </div>
        </div>

        {/* Max liked post */}
        <div className="bg-gray-400 rounded-2xl shadow-lg p-6 mb-10">
          <h2 className="text-xl text-gray-800 font-semibold mb-4">Max Liked Post</h2>
          <SavedPostCard post={maxLikedPost} />
        </div>

        {/* Users who viewed your profile recently */}
        {isPremium && membershipType === "Platinum" && (<div className="bg-gray-400 rounded-2xl shadow-lg p-6 mb-10">
          <h2 className="text-xl text-gray-800 font-semibold mb-4">Users Who Viewed Your Profile Recently</h2>
          <div className="max-h-80 overflow-y-auto pr-4">
          <ul className="space-y-2">
          {profileVisitors.length > 0 && (
            <ul className="space-y-4">
                {profileVisitors.map((visitor) => (
                <li
                    key={visitor.visitorId?._id}
                    className="flex items-center justify-between gap-4 bg-gray-300 rounded-xl p-3 shadow-sm hover:shadow-md transition"
                >
                   <div className="flex items-center gap-4"> 
                    <img
                    src={visitor.visitorId?.photoUrl}
                    alt="user-photo"
                    className="w-12 h-12 rounded-full object-cover border border-gray-300 cursor-pointer"
                    onClick={() => navigate(`/user/profile/${visitor.visitorId?._id}`)}
                    />
                    <p className="text-gray-800 font-medium cursor-pointer" onClick={() => navigate(`/user/profile/${visitor.visitorId?._id}`)}>
                    {visitor.visitorId?.firstName} {visitor.visitorId?.lastName}
                    </p>
                    </div>
                    <p
                        className="text-sm text-blue-600 cursor-pointer"
                        onClick={() => toggleTime(visitor?._id)}
                    >
                        {showTime[visitor?._id] ? visitor.visitedAt : "Check when?"}
                    </p>
                </li>
                ))}
            </ul>
            )}
                {/* Placeholder for no users */}
            {profileVisitors.length === 0 && (
                <div className="flex items-center justify-center h-full mt-20">
                    <p className="text-black text-md">No profile visitors found</p>
                </div>
            )}
          </ul>
          </div>
        </div>)}
  
      </div>
    </div>
  );  
  
};

export default Dashboard;
