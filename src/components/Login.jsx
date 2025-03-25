import { useState } from "react";
import axios from 'axios';
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [emailId, setEmailId] = useState("");
    const [password, setPassword] = useState(""); 
    const [isLoginPage, setIsLoginPage] = useState(true);
    const [error, setError] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const result = await axios.post(BASE_URL + "/login", { emailId, password }, { withCredentials: true });
            dispatch(addUser(result.data.data));
            return navigate("/post/feed");
        } catch(err) {
            setError(err?.response?.data);
        }
    }

    const handleGoogleLogin = () => {
        window.location.href = `${BASE_URL}/google`; // Redirect to Google OAuth
    };

    const handleSignUp = async () => {
        try {
            const result = await axios.post(BASE_URL + "/signup", { firstName, lastName, emailId, password }, { withCredentials: true });
            dispatch(addUser(result.data.data));
            return navigate("/profile");
        } catch(err) {
            setError(err?.response?.data);
        }
    }

    const handleReset = () => {
        setEmailId("");
        setPassword(""); 
    }

    return (
        <div className="flex justify-center">
            <div className="card shadow-2xl rounded-lg w-96" style={{ background: 'linear-gradient(to right, #374151, #6B7280)' }}>
                <div className="card-body p-8 text-white">
                    <h2 className="card-title text-center text-xl font-bold mb-2">
                        {isLoginPage ? 'Login' : 'Sign Up'}
                    </h2>
                    {!isLoginPage && (
                        <>
                            <label className="form-control w-full max-w-xs mx-auto">
                                <span className="label-text text-white">First Name</span>
                                <input type="text" value={firstName} className="input input-bordered w-full mt-1 text-black bg-gray-300" onChange={(e) => setFirstName(e.target.value)} />
                            </label>
                            <label className="form-control w-full max-w-xs mx-auto mt-4">
                                <span className="label-text text-white">Last Name</span>
                                <input type="text" value={lastName} className="input input-bordered w-full mt-1 text-black bg-gray-300" onChange={(e) => setLastName(e.target.value)} />
                            </label>
                        </>
                    )}
                    <label className="form-control w-full max-w-xs mx-auto mt-4">
                        <span className="label-text text-white">Email Id</span>
                        <input type="text" value={emailId} className="input input-bordered w-full mt-1 text-black bg-gray-300" onChange={(e) => setEmailId(e.target.value)} />
                    </label>
                    <label className="form-control w-full max-w-xs mx-auto mt-4 relative">
                        <span className="label-text text-white">Password</span>
                        <div className="relative w-full">
                            <input type={showPassword ? "text" : "password"} value={password} className="input input-bordered w-full mt-1 text-black bg-gray-300" onChange={(e) => setPassword(e.target.value)} />
                            {/* Eye Icon Button */}
                            <button 
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </label>
                    {isLoginPage && <p className="text-right text-blue-400 text-sm mt-1 cursor-pointer hover:text-blue-300 transition duration-200 ease-in-out"
                        onClick={() => navigate("/forgot-password")} // Navigate to Forgot Password Page
                    >
                        Forgot Password?
                    </p>}
                    {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                    <div className="card-actions justify-center mt-6">
                        <button className="btn bg-gray-300 text-blue-500 hover:bg-red-300 mr-4" onClick={handleReset}>Reset</button>
                        <button className="btn bg-gray-300 text-blue-500 hover:bg-green-200" onClick={isLoginPage ? handleLogin : handleSignUp}>
                            {isLoginPage ? 'Login' : 'Sign Up'}
                        </button>
                    </div>

                    { isLoginPage && (<div className="flex items-center my-3">
                    <hr className="flex-grow border-t border-gray-300" />
                    <span className="px-2 text-gray-500">OR</span>
                    <hr className="flex-grow border-t border-gray-300" />
                    </div>) }

                    {/* Google Login Button */}
                    { isLoginPage && (<div className="card-actions justify-center mt-2">
                        <button className="btn bg-red-400 text-white hover:bg-red-500 flex items-center" onClick={handleGoogleLogin}>
                            <img src="/gmail-icon.webp" alt="Google Logo" className="w-10 h-8 mr-2 rounded-full border border-red-700" />
                            Login with Gmail
                        </button>
                    </div>) }
                    <p className="text-center mt-4 cursor-pointer text-sm sm:text-base font-semibold text-blue-400 hover:text-blue-300 transition duration-200 ease-in-out" 
                        onClick={() => setIsLoginPage(val => !val)}>
                        {isLoginPage ? "New User? Sign Up Here" : "Existing User? Login Here"}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
