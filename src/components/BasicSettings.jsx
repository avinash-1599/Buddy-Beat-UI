import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { removeUser, setAccountPrivacy } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";

const BasicSettings = () => {

  const user = useSelector((state) => state.user);

  const [isPrivate, setIsPrivate] = useState(user?.isAccountPrivate);
  // Change Password states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changing, setChanging] = useState(false);

  // State to toggle form
  const [showPasswordForm, setShowPasswordForm] = useState(false);


  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.isAccountPrivate !== undefined) {
      setIsPrivate(user?.isAccountPrivate);
    }
  }, [user?.isAccountPrivate]);

  const handlePrivacyChange = async (e) => {
    const newValue = e.target.checked;
    setIsPrivate(newValue);
    try {
      await axios.post(BASE_URL + "/profile/switch", { isAccountPrivate: newValue }, { withCredentials: true });
      dispatch(setAccountPrivacy(newValue));
      // After dispatch
      alert("Privacy setting updated successfully.");
    } catch (err) {
      console.error("Failed to update privacy setting", err);
    }
  };  

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
  
    if (!confirmed) return;
  
    try {
      await axios.delete(BASE_URL + "/profile/delete", { withCredentials: true });
      dispatch(removeUser());
      navigate("/login");
      alert("Account deleted successfully.");
    } catch (err) {
      console.error("Failed to delete account", err);
      alert("Something went wrong while deleting your account.");
    }
  };  


  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      return alert("New password and confirm password do not match.");
    }

    try {
      setChanging(true);
      await axios.patch(
        `${BASE_URL}/profile/change-password`,
        {
          oldPassword,
          newPassword,
        },
        { withCredentials: true }
      );
      alert("Password updated successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false);
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to update password. Please try again."
      );
    } finally {
      setChanging(false);
    }
  };

  return (
    <div className="flex flex-col h-screen px-4 pt-20 text-gray-300 dark:text-gray-200 bg-gray-700 dark:bg-gray-900">
      <h1 className="text-3xl font-semibold mb-6">Settings</h1>

      {/* Account Privacy Setting */}
      <div className="mb-8 w-full max-w-xs">
        <h2 className="text-xl font-semibold mb-2">Account Privacy</h2>
        <div className="flex items-center gap-3 bg-gray-400 dark:bg-gray-800 px-4 py-2 rounded-lg">
          <input
            type="checkbox"
            id="privacyToggle"
            checked={isPrivate}
            onChange={handlePrivacyChange}
            className="h-4 w-4"
            disabled={user?.isAccountPrivate === undefined}
          />
          <label htmlFor="privacyToggle" className="text-lg text-black">
            Private Account
          </label>
        </div>
      </div>
      
      {/* Change Password Button */}
      {/* Change Password Button */}
      <div className="mb-8 w-full max-w-xs">
        <h2 className="text-xl font-semibold mb-2">Manage Account Password</h2>
        <div className="w-full">
          <button
            onClick={() => setShowPasswordForm(true)}
            className="bg-gray-400 text-lg text-left text-black px-4 py-2 rounded hover:bg-gray-600 transition w-full"
          >
            Change Password
          </button>
        </div>
      </div>
      {/* Change Password Form */}
      {showPasswordForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md text-black dark:text-white">
            <h2 className="text-xl font-semibold mb-4 text-center">Change Password</h2>

            <input
              type="password"
              placeholder="Old Password"
              className="w-full p-2 mb-3 rounded bg-white text-black"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full p-2 mb-3 rounded bg-white text-black"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full p-2 mb-4 rounded bg-white text-black"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <div className="flex justify-between">
              <button
                onClick={handleChangePassword}
                disabled={changing}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
              >
                {changing ? "Updating..." : "Save"}
              </button>
              <button
                onClick={() => {
                  setShowPasswordForm(false);
                  setOldPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Account Deletion */}
      <div className="w-full max-w-xs">
      <h2 className="text-xl font-semibold mb-2">Account Deletion</h2>
      <button
        onClick={handleDeleteAccount}
        className="bg-red-400 hover:bg-red-700 text-white text-left font-semibold py-2 px-4 rounded w-full transition"
      >
        Delete My Account
      </button>
    </div>

    </div>
  );
};

export default BasicSettings;