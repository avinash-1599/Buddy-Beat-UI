/* eslint-disable react/prop-types */
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  const dispatch = useDispatch();
  const { _id, firstName, lastName, photoUrl, age, about, gender } = user;

  const handleSendRequest = async (status, toUserId) => {
    await axios.post(
      `${BASE_URL}/request/sent/${status}/${toUserId}`,
      {},
      { withCredentials: true }
    );

    dispatch(removeUserFromFeed(toUserId));
  };

  return (
    <div className="w-96 bg-gray-100 rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105">
      <img
      src={photoUrl || "/default-avatar.png"}
      alt="User"
      className="w-full h-64 object-cover object-center border-b-2 border-gray-300"
    />
      <div className="p-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          {`${firstName} ${lastName}`}
        </h2>
        {age && gender && (
          <p className="text-lg text-gray-600 mt-1">{`${age}, ${gender}`}</p>
        )}
        <p className="text-gray-700 mt-3 text-sm">{about}</p>
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => handleSendRequest("ignored", _id)}
            className="px-4 py-2 text-white bg-red-500 rounded-lg transition-colors duration-300 hover:bg-red-600"
          >
            Ignore
          </button>
          <button
            onClick={() => handleSendRequest("interested", _id)}
            className="px-4 py-2 text-white bg-blue-500 rounded-lg transition-colors duration-300 hover:bg-blue-600"
          >
            Interested
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
