import { useState } from "react";
import Requests from "./Requests";
import Connections from "./Connections";

const RequestPage = () => {
  const [showConnections, setShowConnections] = useState(false);

  return (
    <div className="p-6 bg-gray-600 min-h-screen flex flex-col items-center">

      {/* Toggle Switch */}
      <div className="flex justify-center mb-6">
        <label className="flex items-center space-x-4 bg-gradient-to-r from-teal-500 to-blue-500 p-2 rounded-full shadow-lg">
          <span className="text-sm text-white font-medium">Requests</span>
          <input
            type="checkbox"
            className="toggle toggle-sm"
            checked={showConnections}
            onChange={() => setShowConnections(!showConnections)}
          />
          <span className="text-sm text-white font-medium">Connections</span>
        </label>
      </div>

      {/* Conditional Rendering */}
      <div className="w-full max-w-4xl bg-gray-500 rounded-lg shadow-md p-6">
        {showConnections ? <Connections /> : <Requests />}
      </div>
    </div>
  );
};

export default RequestPage;
