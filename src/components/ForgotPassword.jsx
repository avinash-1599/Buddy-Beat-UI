import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleResetRequest = async () => {
        try {
            const response = await axios.post(`${BASE_URL}/forgot-password`, { emailId: email });
            setMessage(response.data.message);
        } catch (error) {
            // Check if error has a response and a message
            if (error.response && error.response.data && typeof error.response.data === "string") {
                setMessage(error.response.data);
            } else {
                setMessage("Error sending reset link. Please try again.");
            }
        }
    };    

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
            <input
                type="email"
                placeholder="Enter your email"
                className="input input-bordered w-full max-w-xs p-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button className="btn bg-blue-500 text-white mt-3" onClick={handleResetRequest}>
                Send Reset Link
            </button>
            {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
        </div>
    );
};

export default ForgotPassword;