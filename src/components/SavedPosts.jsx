import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import SavedPostCard from "./SavedPostCard";

const SavedPosts = () => {
    const [savedPosts, setSavedPosts] = useState([]);

    useEffect(() => {
        const fetchSavedPosts = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/post/saved`, { withCredentials: true });
                setSavedPosts(res.data.savedPosts);
            } catch (err) {
                console.error('Error fetching saved posts', err);
            }
        };
        fetchSavedPosts();
    }, []);

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <h2 className={savedPosts.length>0 ? "text-2xl font-bold mb-6 text-left text-white" : "text-2xl font-bold mb-6 text-center text-white"}>Saved Posts</h2>
            {savedPosts.length === 0 ? (
                <p className="text-center text-gray-200">No saved posts yet!</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {savedPosts.map((post) => (
                        <SavedPostCard key={post._id} post={post} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SavedPosts;