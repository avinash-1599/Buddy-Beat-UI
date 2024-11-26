import { useState } from "react";
import axios from 'axios';
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";


const Login = () => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [emailId, setEmailId] = useState("dhoni@test.com");
    const [password, setPassword] = useState("Dhoni@123"); 
    const [isLoginPage, setIsLoginPage] = useState(true);   // state variable to toggle between login and signup form
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async () => {
        try{
            const result = await axios.post(BASE_URL + "/login", {
                emailId,
                password
            }, {withCredentials: true})
            console.log("resssss", result.data.data);

            // save data to redux store
            dispatch(addUser(result.data.data));

            // navigate to / route
            return navigate("/");
        }catch(err){
            setError(err?.response?.data);
            //console.log("Errrorrrr", err.message)
        }
    }

    const handleSignUp = async () => {
        try{
            const result = await axios.post(BASE_URL + "/signup", {
                firstName,
                lastName,
                emailId,
                password
            }, {withCredentials: true})
            console.log("resssss", result.data.data);

            // save data to redux store
            dispatch(addUser(result.data.data));

            // navigate to /profile route
            return navigate("/profile");
        }catch(err){
            setError(err?.response?.data);
            //console.log("Errrorrrr", err.message)
        }
    }

    const handleReset = async () => {
        try{
            setEmailId("");
            setPassword(""); 
        }catch(err){
            console.log("Error resetting form data.");
        }
    }

    return (
        <div className="flex justify-center mt-5">
            <div className="card card-compact bg-base-200 w-96 shadow-xl">
        
            <div className="card-body">
                <h2 className="card-title justify-center"><u>{isLoginPage? 'Login' : 'Sign Up'}</u></h2>
                {!isLoginPage && 
                <>
                <label className="form-control w-full max-w-xs ml-5">
                    <div className="label">
                        <span className="label-text">First Name</span>
                    </div>
                <input type="text" value={firstName} className="input input-bordered w-full max-w-xs"
                onChange={(e) => setFirstName(e.target.value)} />
                </label>

                <label className="form-control w-full max-w-xs ml-5">
                    <div className="label">
                        <span className="label-text">Last Name</span>
                    </div>
                <input type="text" value={lastName} className="input input-bordered w-full max-w-xs"
                onChange={(e) => setLastName(e.target.value)} />
                </label>
                </>
                }

                <label className="form-control w-full max-w-xs ml-5">
                    <div className="label">
                        <span className="label-text">Email Id</span>
                    </div>
                <input type="text" value={emailId} className="input input-bordered w-full max-w-xs"
                onChange={(e) => setEmailId(e.target.value)} />
                </label>

                <label className="form-control w-full max-w-xs ml-5">
                    <div className="label">
                        <span className="label-text">Password</span>
                    </div>
                <input type="text" value={password} className="input input-bordered w-full max-w-xs" 
                onChange={(e) => setPassword(e.target.value)}/>
                </label>
                <p className="text-red-500">{error}</p>
                <div className="card-actions justify-center">
                    <button className="btn btn-primary mr-10 mt-5" onClick={() => handleReset()}>Reset</button>
                    <button className="btn btn-primary mt-5" onClick={isLoginPage ? () => handleLogin() : () => handleSignUp()}>{isLoginPage ? 'Login' : 'Sign Up'}</button>
                </div>
                <p className="m-auto cursor-pointer mt-5" onClick={() => setIsLoginPage(val => !val)}>{isLoginPage ? 'New User, Sign Up Here' : 'Existing User, Login Here'}</p>
            </div>
            </div>
        </div>
    )
}

export default Login;