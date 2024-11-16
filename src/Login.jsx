import { useState } from "react";
import axios from 'axios';


const Login = () => {

    const [emailId, setEmailId] = useState("");
    const [password, setPassword] = useState(""); 

    const handleLogin = async () => {
        try{
            const result = await axios.post("http://localhost:7777/login", {
                emailId,
                password
            }, {withCredentials: true})
        }catch(err){
            console.log("Errrorrrr", err.message)
        }
    }

    return (
        <div className="flex justify-center mt-5">
            <div className="card card-compact bg-base-200 w-96 shadow-xl">
        
            <div className="card-body">
                <h2 className="card-title justify-center"><u>Login</u></h2>
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
                <div className="card-actions justify-center">
                    <button className="btn btn-primary mr-10 mt-5">Reset</button>
                    <button className="btn btn-primary mt-5" onClick={() => handleLogin()}>Login</button>
                </div>

            </div>
            </div>
        </div>
    )
}

export default Login;