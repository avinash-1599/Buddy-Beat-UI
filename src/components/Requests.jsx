import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequest, removeRequest } from "../utils/requestSlice";
import { useEffect } from "react";

const Requests = () => {
    const requests = useSelector(store => store.requests);
    const dispatch = useDispatch();

    const reviewRequest = async (status, requestId) => {
        try {
            await axios.post(`${BASE_URL}/request/review/${status}/${requestId}`, {}, { withCredentials: true });
            dispatch(removeRequest(requestId));
        } catch (error) {
            console.error("Error reviewing request:", error.message);
        }
    };

    const fetchRequests = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/user/requests/recieved`, { withCredentials: true });
            dispatch(addRequest(res.data.data));
        } catch (err) {
            console.error("Error fetching requests:", err.message);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    if (!requests) return null;

    if (requests.length === 0) return <h1 className="flex justify-center my-10 text-xl font-semibold">No Requests Found</h1>;

    return (
        <div className="my-10 px-5">
            {requests.map(request => {
                if (!request.fromUserId) return null;

                const { _id, firstName, lastName, age, gender, about, photoUrl } = request.fromUserId;

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
                        <div className="flex gap-3">
                            <button className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition" onClick={() => reviewRequest("rejected", request._id)}>Reject</button>
                            <button className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition" onClick={() => reviewRequest("accepted", request._id)}>Accept</button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Requests;
