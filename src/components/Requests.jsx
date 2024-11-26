import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequest, removeRequest } from "../utils/requestSlice";
import { useEffect } from "react";

const Requests = () => {

    const requests = useSelector(store => store.requests);
    const dispatch = useDispatch();

    const reviewRequest = async (status, requestId) => {

        const res = await axios.post(BASE_URL + '/request/review/'+status+'/'+requestId,
            {}, {withCredentials: true}
        );

        dispatch(removeRequest(requestId));
    }

    const fetchRequests = async () => {
        try{
            const res = await axios.get(BASE_URL+'/user/requests/recieved', {withCredentials: true});

            dispatch(addRequest(res.data.data));
        }catch(err){
            console.log(err.message);
        }
    }

    useEffect(() => {
        fetchRequests()
    }, [])


    if(!requests) return;

    if(requests.length === 0) return <h1 className="flex justify-center my-10">No Requests Found</h1>

    return (
        <div className="text-center my-10">
            <h1 className="text-bold text-3xl"><u>My Requests</u></h1>
            {requests.map(request => {
                console.log('check-req', request)
                const {_id, firstName, lastName, age, gender, about, photoUrl} = request.fromUserId;

                return (
                    <div key={_id} className="flex justify-between m-4 p-4 rounded-lg bg-base-300 w-1/2 mx-auto">
                        <div>
                        <img className= 'w-20 h-20 mx-5 rounded-full' src={photoUrl} alt="photo" />
                        </div>
                        <div className="text-left mx-5">
                        <h2 className="font-bold text-xl">{firstName + ' ' + lastName}</h2>
                        {age && gender && <p>{age + ', ' + gender}</p>}
                        <p>{about}</p>
                        </div>
                        <div className="card-actions justify-center my-3">
                            <button className="btn btn-primary" onClick={() => reviewRequest("rejected", request._id)}>Reject</button>
                            <button className="btn btn-secondary" onClick={() => reviewRequest("accepted", request._id)}>Accept</button>
                        </div>
                        
                    </div>
                )
            })}
        </div>
    )
}

export default Requests;