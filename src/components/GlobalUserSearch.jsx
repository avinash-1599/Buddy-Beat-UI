// components/GlobalUserSearch.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const GlobalUserSearch = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.trim()) {
        axios
          .get(`${BASE_URL}/user/all-users?q=${query}`, { withCredentials: true })
          .then((res) => setResults(res.data.data))
          .catch((err) => console.error("Search error", err));
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  const handleSelect = (userId) => {
    setQuery("");
    setResults([]);
    onClose();
    navigate(`/user/profile/${userId}`);
  };

  return (
    <div className="relative w-64">
      <input
        type="text"
        className="w-full px-3 py-1 rounded-md border border-gray-400 text-black focus:outline-none"
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />
      {results.length > 0 && (
        <div className="absolute mt-1 w-full bg-white text-black rounded-md shadow-md z-50 max-h-60 overflow-y-auto">
          {results.map((user) => (
            <div
              key={user._id}
              className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
              onClick={() => handleSelect(user._id)}
            >
              <img
                src={user.photoUrl}
                alt={user.firstName}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span>{user.firstName} {user.lastName}</span>
            </div>
          ))}
        </div>
      )}
      {query && results.length === 0 && (
        <div className="absolute mt-1 w-full bg-white text-gray-500 rounded-md shadow p-2">
          No users found.
        </div>
      )}
    </div>
  );
};

export default GlobalUserSearch;
