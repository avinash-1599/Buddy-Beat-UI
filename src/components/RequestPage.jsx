import { useState } from "react";
import Requests from "./Requests";
import Connections from "./Connections";

const RequestPage = () => {
  const [showConnections, setShowConnections] = useState(false);

  return (
    <div className="p-4">
      {/* Toggle switch */}
      <div className="flex justify-end mb-4">
        <label className="flex items-center space-x-2">
          <span className="text-sm">Requests</span>
          <input
            type="checkbox"
            className="toggle toggle-sm"
            checked={showConnections}
            onChange={() => setShowConnections(!showConnections)}
          />
          <span className="text-sm">Connections</span>
        </label>
      </div>

      {/* Conditional Rendering */}
      {showConnections ? <Connections /> : <Requests />}
    </div>
  );
};

export default RequestPage;
