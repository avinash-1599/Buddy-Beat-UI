import axios from "axios";
import { useState } from "react";
import { BASE_URL } from "../utils/constants";

const LoginUsingOTP = () => {
  const [step, setStep] = useState("phone"); // 'phone' or 'otp'
  const [emailId, setEmailId] = useState("");
  const [otp, setOTP] = useState("");

  const handleSendOTP = async () => {
    if (emailId.match(/^[0-9]{10}$/)) {
      console.log("Sending OTP to:", emailId);
      await axios.post(BASE_URL + "/send/otp", { emailId });
      // Simulate OTP sending
      setStep("otp");
    } else {
      alert("Enter a valid 10-digit phone number");
    }
  };

  const handleVerifyOTP = () => {
    if (otp.length === 6) {
      console.log("Verifying OTP:", otp);
      // Simulate verification
      alert("OTP Verified! 🎉");
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

        {step === "phone" ? (
          <>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Id
            </label>
            <input
              type="tel"
              maxLength={10}
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              placeholder="Enter 10-digit mobile number"
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
              onClick={() => setStep("phone")}
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