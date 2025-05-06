import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";
import Chat from "./Chat"; // Import Chat component

const Connections = () => {
    const connections = useSelector(store => store.connections);
    const dispatch = useDispatch();
    const [chatUserId, setChatUserId] = useState(null); // Manage chat visibility
    const [searchTerm, setSearchTerm] = useState(""); // Search bar state

    const fetchConnections = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/user/connections`, { withCredentials: true });
            dispatch(addConnection(res.data.data));
        } catch (err) {
            console.error("Error fetching connections:", err.message);
        }
    };

    useEffect(() => {
        fetchConnections();
    }, []);

    if (!connections) return null;
    if (connections.length === 0) return <h1 className="flex justify-center my-10 text-xl text-white font-semibold">No Connections Found</h1>;

    // Filter connections based on search term
    const filteredConnections = connections.filter(connection => {
        const fullName = `${connection.firstName} ${connection.lastName}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
    });

    return (
        <div className="min-h-screen pt-10 my-10 px-5 relative flex flex-col items-center">
            {/* Heading and Search Bar */}
            <div className="max-w-2xl w-full mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-400">Your Connections</h1>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name..."
                    className="w-full sm:w-64 px-4 py-2 bg-gray-300 rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            <div className="max-w-2xl w-full flex flex-col gap-4">
            {filteredConnections.length === 0 ? <p className="text-center text-gray-200 text-lg font-medium mt-10">No connections match your search.</p> 
                : (filteredConnections.map(connection => {
                const { _id, firstName, lastName, age, gender, about, photoUrl } = connection;
    
                return (
                    <div key={_id} className="flex flex-col sm:flex-row items-center sm:justify-between p-5 rounded-lg bg-gray-300 shadow-md w-full">
                        {/* User Info Section */}
                        <div className="flex items-center gap-4 w-full">
                            <img className="w-16 h-16 rounded-full object-cover" src={photoUrl} alt={`${firstName} ${lastName}`} />
                            <div className="text-left flex-1">
                                <h2 className="font-bold text-lg">{firstName} {lastName}</h2>
                                {age && gender && <p className="text-gray-600 text-sm">{age}, {gender}</p>}
                                <p className="text-gray-700 text-sm mt-1">{about}</p>
                            </div>
                        </div>
    
                        {/* Chat Button Section */}
                        <div className="mt-4 sm:mt-0 w-full sm:w-auto text-center">
                            <button
                                onClick={() => setChatUserId(_id)}
                                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition w-full sm:w-auto"
                            >
                                Chat
                            </button>
                        </div>
                    </div>
                );
            }))}
            </div>
    
            {/* Chat Dialogue Box */}
            {chatUserId && (
                <div className="fixed top-16 right-6 w-[350px]">
                    <Chat targetUserId={chatUserId} onClose={() => setChatUserId(null)} />
                </div>
            )}
        </div>
    );    
};

export default Connections;