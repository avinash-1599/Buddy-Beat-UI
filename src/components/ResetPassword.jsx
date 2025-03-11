import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const ResetPassword = () => {
    const { resetToken } = useParams(); // Get token from URL
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleReset = async () => {
        if (!password) {
            setMessage("Password cannot be empty.");
            return;
        }
        try {
            const response = await axios.post(`${BASE_URL}/reset-password/${resetToken}`, { newPassword: password });
            setMessage(response.data.message);
        } catch (error) {
            // Check if error has a response and a message
            if (error.response && error.response.data && typeof error.response.data === "string") {
                setMessage(error.response.data);
            } else {
                setMessage("Error in reset password. Please try again.");
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h2 className="text-xl font-bold mb-4">Reset Your Password</h2>
            <input
                type="password"
                placeholder="New Password"
                className="input input-bordered w-full max-w-xs p-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn bg-green-500 text-white mt-3" onClick={handleReset}>
                Reset Password
            </button>
            {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
        </div>
    );
};

export default ResetPassword;