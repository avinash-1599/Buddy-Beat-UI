import { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
    const connections = useSelector(store => store.connections);
    const dispatch = useDispatch();

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
        <div className="my-10 px-5">
            {connections.map(connection => {
                const { _id, firstName, lastName, age, gender, about, photoUrl } = connection;

                return (
                    <div key={_id} className="flex items-center justify-between p-5 rounded-lg bg-gray-100 shadow-md w-full max-w-2xl mx-auto mb-4">
                        <div className="flex items-center gap-4">
                            <img className="w-16 h-16 rounded-full object-cover" src={photoUrl} alt={`${firstName} ${lastName}`} />
                            <div className="text-left">
                                <h2 className="font-bold text-lg">{firstName} {lastName}</h2>
                                {age && gender && <p className="text-gray-600 text-sm">{age}, {gender}</p>}
                                <p className="text-gray-700 text-sm mt-1">{about}</p>
                            </div>
                        </div>
                        <Link to={`/chat/${_id}`}>
                            <button className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition">Chat</button>
                        </Link>
                    </div>
                );
            })}
        </div>
    );
};

export default Connections;