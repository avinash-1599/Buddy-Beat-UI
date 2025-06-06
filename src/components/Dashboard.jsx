import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Dashboard = () => {
  const [counts, setCounts] = useState({
    totalPosts: 0,
    totalLockedPosts: 0,
    totalStories: 0,
    totalConnections: 0,
    totalRequests: 0,
  });

  useEffect(() => {
    fetchDashboardCounts();
  }, []);

  const fetchDashboardCounts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/dashboard/totalCounts`, {
        withCredentials: true,
      });
      
      if (response?.data) {
        setCounts({
            totalPosts: response.data.totalPosts || 0,
            totalLockedPosts: response.data.totalLockedPosts || 0,
            totalStories: response.data.totalStories || 0,
            totalConnections: response.data.totalConnections || 0,
            totalRequests: response.data.totalRequests || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard counts:", error);
    }
  };

  const cards = [
    { title: "Total Posts", value: counts.totalPosts },
    { title: "Locked Posts", value: counts.totalLockedPosts },
    { title: "Total Stories", value: counts.totalStories },
    { title: "Connections", value: counts.totalConnections },
    { title: "Connection Requests", value: counts.totalRequests },
  ];

  return (
    <div className="w-full pt-6 px-4">
      <h1 className="text-2xl text-gray-200 font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white shadow-lg rounded-2xl p-6 text-center border border-gray-200"
          >
            <h2 className="text-gray-500 text-sm font-medium mb-2">{card.title}</h2>
            <div className="text-4xl font-bold text-blue-600">{card.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
