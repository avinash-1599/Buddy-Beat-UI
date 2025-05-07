import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const LocationTagger = () => {
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {

            const res = await axios.get(`${BASE_URL}/api-key/${'locationIQ'}`, {withCredentials: true});
            console.log("resolt-key", res.data);

          const locationRes = await axios.get(
            `https://us1.locationiq.com/v1/reverse?key=${res.data.data}&lat=${latitude}&lon=${longitude}&format=json`
          );

          setLocation(locationRes.data.display_name); // readable address
        } catch (err) {
          console.error("Error fetching location:", err);
          setError("Failed to fetch location");
        }
      },
      (err) => {
        setError("Permission denied or error fetching location");
      }
    );
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Tagged Location</h2>
      {error && <p className="text-red-500">{error}</p>}
      {location ? <p className="text-gray-700">{location}</p> : <p>Fetching location...</p>}
    </div>
  );
};

export default LocationTagger;
