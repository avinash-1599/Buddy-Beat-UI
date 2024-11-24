import { useSelector } from "react-redux";
import EditProfile from "./EditProfile";

const Profile = () => {
    const user = useSelector(store => store.user);
    console.log("user-data-store", user);
    return (user && (
        <EditProfile user={user}></EditProfile>
        )
    )
}

export default Profile;