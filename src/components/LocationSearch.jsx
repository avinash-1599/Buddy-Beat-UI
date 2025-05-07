import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

// eslint-disable-next-line react/prop-types
const LocationSearch = ({ onLocationSelect }) => {
  const [apiKey, setApiKey] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query || !apiKey) return;

    try {
      const res = await axios.get(`${BASE_URL}/api-key/locationIQ`, { withCredentials: true });
      const locRes = await axios.get(
        `https://us1.locationiq.com/v1/search?key=${res.data.data}&q=${encodeURIComponent(query)}&format=json`
      );
      setResults(locRes.data);
    } catch (err) {
      setError("Error fetching location results.");
    }
  };

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api-key/locationIQ`, { withCredentials: true });
        setApiKey(res.data.data);
      } catch {
        setError("Failed to load location API key.");
      }
    };
    fetchApiKey();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      // Prevent re-fetching if user selects a suggestion (already shown)
      if (query.length > 2 && apiKey && !results.find(r => r.display_name === query)) {
        handleSearch();
      }
    }, 500);
  
    return () => clearTimeout(delayDebounce);
  }, [query, apiKey]);  

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Tag Location</label>
      <div className="flex mb-2 gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter location..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <ul className="space-y-2">
        {results.map((loc, idx) => (
          <li
            key={idx}
            onClick={() => {
              onLocationSelect(loc);  
              setQuery(loc.display_name); 
              setResults([]);  
            }}
            className="cursor-pointer p-2 bg-gray-100 rounded hover:bg-gray-200"
          >
            {loc.display_name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LocationSearch;
