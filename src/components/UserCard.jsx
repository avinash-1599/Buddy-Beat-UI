import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({user}) => {

  const dispatch = useDispatch();

    const {_id, firstName, lastName, photoUrl, age, about, gender } = user;

    const handleSendRequest = async (status, toUserId) => {

      const res = await axios.post(BASE_URL + '/request/sent/' + status + '/' + toUserId,
        {}, {withCredentials: true}
      );

      dispatch(removeUserFromFeed(toUserId));
    }

    return (
      <div className="card bg-base-300 w-96 shadow-xl">
      <figure>
        <img
          src={photoUrl || '../../public/dhoni.png'}
          alt="Photo" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{firstName + ' ' + lastName}</h2>
        {age && gender && <p>{age + ', ' + gender}</p>}
        <p>{about}</p>
        <div className="card-actions justify-center my-3">
          <button className="btn btn-primary" onClick={() => handleSendRequest('ignored', _id)}>Ignore</button>
          <button className="btn btn-secondary" onClick={() => handleSendRequest('interested', _id)}>Interested</button>
        </div>
      </div>
    </div>
    )
}

export default UserCard;