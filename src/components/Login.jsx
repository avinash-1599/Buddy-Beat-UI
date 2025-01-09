import { useState } from "react";
import axios from 'axios';
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [emailId, setEmailId] = useState("");
    const [password, setPassword] = useState(""); 
    const [isLoginPage, setIsLoginPage] = useState(true);
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const result = await axios.post(BASE_URL + "/login", { emailId, password }, { withCredentials: true });
            dispatch(addUser(result.data.data));
            return navigate("/");
        } catch(err) {
            setError(err?.response?.data);
        }
    }

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
        <div className="flex justify-center mt-10">
            <div className="card shadow-2xl rounded-lg w-96" style={{ background: 'linear-gradient(to right, black, gray)' }}>
                <div className="card-body p-8 text-white">
                    <h2 className="card-title text-center text-xl font-bold mb-4">
                        {isLoginPage ? 'Login' : 'Sign Up'}
                    </h2>
                    {!isLoginPage && (
                        <>
                            <label className="form-control w-full max-w-xs mx-auto">
                                <span className="label-text text-white">First Name</span>
                                <input type="text" value={firstName} className="input input-bordered w-full mt-1 text-black" onChange={(e) => setFirstName(e.target.value)} />
                            </label>
                            <label className="form-control w-full max-w-xs mx-auto mt-4">
                                <span className="label-text text-white">Last Name</span>
                                <input type="text" value={lastName} className="input input-bordered w-full mt-1 text-black" onChange={(e) => setLastName(e.target.value)} />
                            </label>
                        </>
                    )}
                    <label className="form-control w-full max-w-xs mx-auto mt-4">
                        <span className="label-text text-white">Email Id</span>
                        <input type="text" value={emailId} className="input input-bordered w-full mt-1 text-black" onChange={(e) => setEmailId(e.target.value)} />
                    </label>
                    <label className="form-control w-full max-w-xs mx-auto mt-4">
                        <span className="label-text text-white">Password</span>
                        <input type="password" value={password} className="input input-bordered w-full mt-1 text-black" onChange={(e) => setPassword(e.target.value)} />
                    </label>
                    {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                    <div className="card-actions justify-center mt-6">
                        <button className="btn bg-white text-blue-500 hover:bg-red-300 mr-4" onClick={handleReset}>Reset</button>
                        <button className="btn bg-white text-blue-500 hover:bg-green-200" onClick={isLoginPage ? handleLogin : handleSignUp}>
                            {isLoginPage ? 'Login' : 'Sign Up'}
                        </button>
                    </div>
                    <p className="text-center mt-4 cursor-pointer" onClick={() => setIsLoginPage(val => !val)}>
                        {isLoginPage ? 'New User? Sign Up Here' : 'Existing User? Login Here'}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
