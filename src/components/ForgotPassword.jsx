import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { motion } from "framer-motion";
import { FaEnvelope, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleResetRequest = async () => {
        if (!email.trim()) {
            setMessage({ text: "Please enter a valid email!", type: "error" });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const response = await axios.post(`${BASE_URL}/forgot-password`, { emailId: email });
            setMessage({ text: response.data.message, type: "success" });
        } catch (error) {
            setMessage({
                text: error.response?.data || "Error sending reset link. Please try again.",
                type: "error"
            });
        }

        setLoading(false);
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700 px-4">
            <motion.div 
                initial={{ opacity: 0, y: -30 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }}
                className="bg-gray-800 text-white p-8 rounded-lg shadow-xl w-full max-w-md"
            >
                <h2 className="text-3xl font-bold text-center mb-4">Forgot Password</h2>
                <p className="text-gray-400 text-center mb-6">
                    Enter your email below to receive a password reset link.
                </p>
                
                <div className="relative mb-4">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full p-3 pl-10 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <FaEnvelope className="absolute left-3 top-3 text-gray-400 text-lg" />
                </div>

                <button 
                    className={`w-full mt-2 p-3 rounded-md text-white font-bold transition duration-200 ${loading ? "bg-gray-600 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
                    onClick={handleResetRequest}
                    disabled={loading}
                >
                    {loading ? "Sending..." : "Send Reset Link"}
                </button>

                {message && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.3 }}
                        className={`mt-4 p-3 text-center rounded-md flex items-center justify-center ${message.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
                    >
                        {message.type === "success" ? <FaCheckCircle className="mr-2" /> : <FaExclamationCircle className="mr-2" />}
                        {message.text}
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default ForgotPassword;