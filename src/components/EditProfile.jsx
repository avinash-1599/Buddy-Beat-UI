/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import UserCard from "./UserCard";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";

const EditProfile = ({ user }) => {
    const [firstName, setFirstName] = useState(user?.firstName || "");
    const [lastName, setLastName] = useState(user?.lastName || "");
    const [age, setAge] = useState(user?.age || "");
    const [gender, setGender] = useState(user?.gender || "");
    const [about, setAbout] = useState(user?.about || "");
    const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || "");
    const [error, setError] = useState("");
    const [toastMsg, setToastMsg] = useState(false);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    // profile photo upload Cropper state
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [showCropper, setShowCropper] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);

    
    const genderOptions = ["male", "female", "others"];
    const dispatch = useDispatch();

    const onCropComplete = (_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };    

    const handleCrop = async () => {
        try {
            const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
            const croppedFile = new File([croppedBlob], "profile.jpg", { type: "image/jpeg" });
            setFile(croppedFile);
            setShowCropper(false);
            await uploadImageToS3();
        } catch (e) {
            console.error("Cropping failed", e);
            setError("Image cropping failed.");
        }
    };

    const readFile = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.addEventListener("load", () => resolve(reader.result));
            reader.readAsDataURL(file);
        });
    };    

    const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile); // Keeps the file for upload
    
            // Read the file as base64 and set the image source for cropping
            const imageDataUrl = await readFile(selectedFile);
            setImageSrc(imageDataUrl); // Sets the base64 image for the cropper
            setShowCropper(true);      // Opens the cropper modal
        }
    };
    

    const uploadImageToS3 = async () => {
        if (!file) return;
        setUploading(true);

        try {
            const { data } = await axios.get(`${BASE_URL}/get-presigned-url`, {
                params: { fileName: file.name, fileType: file.type },
            });
            await axios.put(data.uploadUrl, file, {
                headers: { "Content-Type": file.type },
            });
            setPhotoUrl(data.filePath);
        } catch (error) {
            console.error("Upload error:", error);
            setError("Failed to upload image.");
        } finally {
            setUploading(false);
        }
    };

    const updateProfile = async () => {
        setError("");
        if (isNaN(age) || age < 1 || age > 120) {
            setError("Please enter a valid age (1-120). ");
            return;
        }

        try {
            const res = await axios.patch(BASE_URL + "/profile/edit", 
                { firstName, lastName, age, gender, about, photoUrl },
                { withCredentials: true }
            );
            dispatch(addUser(res?.data?.data));
            setToastMsg(true);
            setTimeout(() => setToastMsg(false), 3000);
        } catch (err) {
            console.error("Error updating profile:", err);
            setError(err.response?.data || err.message || "An unexpected error occurred.");
        }
    };

    return (
        <div className="flex flex-col md:flex-row justify-center items-center gap-10 my-10 p-6">
            {/* Form Section */}
            <div className="bg-white p-6 shadow-lg rounded-lg w-full md:w-1/2">
                <h2 className="text-2xl font-semibold text-center mb-4">Update Profile</h2>
                <div className="space-y-4">
                    {/* First Name */}
                    <div>
                        <label className="block text-lg font-medium">First Name</label>
                        <input type="text" value={firstName} className="input input-bordered w-full"
                            onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    
                    {/* Last Name */}
                    <div>
                        <label className="block text-lg font-medium">Last Name</label>
                        <input type="text" value={lastName} className="input input-bordered w-full"
                            onChange={(e) => setLastName(e.target.value)} />
                    </div>

                    {/* Age */}
                    <div>
                        <label className="block text-lg font-medium">Age</label>
                        <input type="number" value={age} className="input input-bordered w-full"
                            onChange={(e) => setAge(e.target.value)} />
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="block text-lg font-medium">Gender</label>
                        <select value={gender} className="select select-bordered w-full"
                            onChange={(e) => setGender(e.target.value)}>
                            <option value="">Select Gender</option>
                            {genderOptions.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="block text-lg font-medium">Profile Picture</label>
                        <input type="file" onChange={handleFileChange} className="file-input w-full" />
                        <button className="btn btn-primary mt-2" onClick={uploadImageToS3} disabled={uploading || !file}>
                            {uploading ? "Uploading..." : "Upload Image"}
                        </button>
                        {photoUrl && <img src={photoUrl} alt="Profile" className="w-20 h-20 rounded-full mt-3" />}
                    </div>

                    {/* About */}
                    <div>
                        <label className="block text-lg font-medium">About</label>
                        <textarea value={about} className="textarea textarea-bordered w-full"
                            onChange={(e) => setAbout(e.target.value)} placeholder="Tell us about yourself..." />
                    </div>

                    {/* Error Message */}
                    {error && <p className="text-red-500 text-center">{error}</p>}

                    {/* Update Button */}
                    <div className="flex justify-center">
                        <button className="btn btn-success w-full" onClick={updateProfile}>Update Profile</button>
                    </div>
                </div>
            </div>

            {/* User Card Section */}
            <div className="w-full md:w-1/3">
                <UserCard user={{ firstName, lastName, age, gender, about, photoUrl }} />
            </div>

            {/* Toast Message */}
            {toastMsg && (
                <div className="toast toast-top toast-end">
                    <div className="alert alert-success">
                        <span>Profile updated successfully.</span>
                    </div>
                </div>
            )}

            {/* Cropper Modal */}
            {showCropper && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
                <div className="bg-white p-4 rounded-lg w-[60vw] h-[60vh] flex flex-col items-center justify-between">
                    
                    {/* Cropper Area */}
                    <div className="relative w-full h-full">
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                            objectFit="contain"
                        />
                    </div>
            
                    {/* Buttons */}
                    <div className="flex justify-end gap-4 mt-4 w-full">
                        <button className="btn btn-secondary" onClick={() => setShowCropper(false)}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleCrop}>Crop & Upload</button>
                    </div>
                </div>
            </div>
            
            )}
        </div>
    );
};

export default EditProfile;
