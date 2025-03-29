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
    if (connections.length === 0) return <h1 className="flex justify-center my-10 text-xl font-semibold">No Connections Found</h1>;

    return (
        <div className="my-10 px-5 relative">
            {connections.map(connection => {
                const { _id, firstName, lastName, age, gender, about, photoUrl } = connection;
    
                return (
                    <div key={_id} className="flex flex-col sm:flex-row items-center sm:justify-between p-5 rounded-lg bg-gray-100 shadow-md w-full max-w-2xl mx-auto mb-4 gap-4">
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
            })}
    
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