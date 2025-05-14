import axios from "axios";
import { useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom"; // for redirect
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const LoginUsingOTP = () => {
  const [step, setStep] = useState("email");
  const [emailId, setEmailId] = useState("");
  const [otp, setOTP] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSendOTP = async () => {
    if (emailId.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      try {
        await axios.post(BASE_URL + "/send/otp", { emailId });
        setStep("otp");
      } catch (err) {
        alert(err.response?.data?.message || "Failed to send OTP");
      }
    } else {
      alert("Enter a valid Email Id");
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length === 6) {
      try {
        const res = await axios.post(BASE_URL + "/verify/otp", {
          emailId,
          otp,
        },
        { withCredentials: true } // Include credentials for session management);
        );

        if (res.data.data) {
          dispatch(addUser(res.data.data));
          navigate("/post/feed");
        }

        // Clear inputs
        setEmailId("");
        setOTP("");
        setStep("email");
      } catch (err) {
        alert(err.response?.data?.message || "OTP verification failed");
      }
    } else {
      alert("Enter a valid 6-digit OTP");
    }
  };

  return (
    <div className="w-[400px] h-[500px] bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center px-4">
      <div className="bg-gray-300 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Login with OTP
        </h2>

        {step === "email" ? (
          <>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Id
            </label>
            <input
              type="text"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              placeholder="Enter your Email Id"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSendOTP}
              className="w-full mt-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Send OTP
            </button>
          </>
        ) : (
          <>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter OTP
            </label>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOTP(e.target.value)}
              placeholder="6-digit OTP"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 tracking-widest text-center"
            />
            <button
              onClick={handleVerifyOTP}
              className="w-full mt-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Verify OTP
            </button>

            <button
              onClick={() => {
                setStep("email");
                setOTP("");
              }}
              className="w-full mt-2 text-sm text-gray-500 hover:underline"
            >
              Go back
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginUsingOTP;