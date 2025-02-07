import { useState } from "react";
import axios from 'axios';
import UserCard from "./UserCard";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
    //console.log('user-info', user);
    
    // Initialize state with default values
    const [firstName, setFirstName] = useState(user?.firstName || '');
    const [lastName, setLastName] = useState(user?.lastName || ''); 
    const [age, setAge] = useState(user?.age || '');
    const [gender, setGender] = useState(user?.gender || '');
    const [about, setAbout] = useState(user?.about || '');  // Default to empty string
    const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || '');
    const [error, setError] = useState('');
    const [toastMsg, setToastMsg] = useState(false);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const genderOptions = ['male', 'female', 'others'];

    const dispatch = useDispatch();

    // Handle file selection
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    // Upload image to S3
    const uploadImageToS3 = async () => {
        if (!file) return;
        setUploading(true);

        try {
            // 1. Get pre-signed URL from backend
            const { data } = await axios.get(`${BASE_URL}/get-presigned-url`, {
                params: { fileName: file.name, fileType: file.type },
            });

            // 2. Upload file to S3 using the signed URL
            await axios.put(data.uploadUrl, file, {
                headers: { "Content-Type": file.type },
            });

            // 3. Set the photo URL from S3
            setPhotoUrl(data.filePath);
            setUploading(false);
        } catch (error) {
            console.error("Upload error:", error);
            setError("Failed to upload image.");
            setUploading(false);
        }
    };

    // Update profile function
    const updateProfile = async () => {
        // Clear previous errors
        setError('');
        
        // Simple age validation (ensure it's a number)
        if (isNaN(age) || age < 1 || age > 120) {
            setError('Please enter a valid age (1-120).');
            return;
        }

        try {
            const res = await axios.patch(BASE_URL + '/profile/edit', 
                { firstName, lastName, age, gender, about, photoUrl },
                { withCredentials: true }
            );

            // Dispatch the updated user to Redux
            dispatch(addUser(res?.data?.data));

            // Show the toast message
            setToastMsg(true);

            // Hide the toast message after 3 seconds
            setTimeout(() => {
                setToastMsg(false);
            }, 3000);

        } catch (err) {
            // Log the error and show the error message
            console.error('Error updating profile:', err);
            setError(err.response?.data || err.message || 'An unexpected error occurred.');
        }
    };

    return (
        <div className="flex justify-center my-20 mt-5">
            <div className="flex justify-center mx-10">
                <div className="card card-compact bg-base-200 w-96 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title justify-center"><u>Edit Profile</u></h2>

                        {/* Form Fields */}
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

                        <label className="form-control w-full max-w-xs ml-5">
                            <div className="label">
                                <span className="label-text">Age</span>
                            </div>
                            <input type="number" value={age} className="input input-bordered w-full max-w-xs" 
                                onChange={(e) => setAge(e.target.value)} />
                        </label>

                        {/* Gender Dropdown */}
                        <label className="form-control w-full max-w-xs ml-5">
                            <div className="label">
                                <span className="label-text">Gender</span>
                            </div>
                            <select 
                                value={gender} 
                                className="select select-bordered w-full max-w-xs"
                                onChange={(e) => setGender(e.target.value)} 
                            >
                                <option value="">Select Gender</option>
                                {genderOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </label>

                        {/* <label className="form-control w-full max-w-xs ml-5">
                            <div className="label">
                                <span className="label-text">Photo URL</span>
                            </div>
                            <input type="text" value={photoUrl} className="input input-bordered w-full max-w-xs" 
                                onChange={(e) => setPhotoUrl(e.target.value)} />
                        </label> */}

                        {/* File Upload */}
                        <label className="form-control w-full max-w-xs ml-5">
                            <div className="label"><span className="label-text">Profile Picture</span></div>
                            <div className="flex items-center justify-center border rounded-lg p-2">
                                <input 
                                    type="file" 
                                    onChange={handleFileChange} 
                                    className="w-full text-gray-700 file:bg-blue-500 file:text-white file:border-none file:px-4 file:py-2 file:rounded-lg"
                                />
                            </div>
                            <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                                onClick={uploadImageToS3} disabled={uploading || !file}>
                                {uploading ? "Uploading..." : "Upload Image"}
                            </button>
                        </label>

                        {/* Image Preview */}
                        {photoUrl && (
                            <div className="flex justify-center mt-2">
                                <img src={photoUrl} alt="Profile" className="w-32 h-32 object-cover rounded-full" />
                            </div>
                        )}

                        {/* About (Text Area) */}
                        <label className="form-control w-full max-w-xs ml-5">
                            <div className="label">
                                <span className="label-text">About</span>
                            </div>
                            <textarea
                                value={about}
                                className="textarea textarea-bordered w-full max-w-xs h-24"
                                onChange={(e) => setAbout(e.target.value)}
                                placeholder="Tell us about yourself..."
                            />
                        </label>

                        {/* Error message */}
                        <p className="text-red-400">{error}</p>

                        {/* Update Button */}
                        <div className="card-actions justify-center">
                            <button 
                                type="button"  // Prevent form submission
                                className="btn btn-primary mt-5" 
                                onClick={updateProfile}
                            >
                                Update Profile
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* Display User Card */}
            <UserCard user={{ firstName, lastName, age, gender, about, photoUrl }} />

            {/* Toast Message */}
            {toastMsg && (
                <div className="toast toast-top toast-end">
                    <div className="alert alert-success">
                        <span>Profile updated successfully.</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditProfile;
