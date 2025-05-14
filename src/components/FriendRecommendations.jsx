import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Compass } from "lucide-react";

const FriendRecommendations = () => {
    const user = useSelector((store) => store.user);
    const [recommendations, setRecommendations] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const navigate = useNavigate();


    const [showInviteInput, setShowInviteInput] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [sending, setSending] = useState(false);

    const handleInvite = async () => {
        if (!inviteEmail) return alert("Please enter an email address.");
        try {
            setSending(true);
            await axios.post(`${BASE_URL}/invite-friend`, {
                email: inviteEmail,
                senderName: `${user.firstName + " " +user.lastName}`,
            });
            alert("Invite sent!");
            setInviteEmail("");
        } catch (err) {
            console.error("Invite error:", err);
            alert("Failed to send invite.");
        } finally {
            setSending(false);
        }
    };

    useEffect(() => {
        if (!user?._id) return;

        const fetchRecommendations = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/recommendations/${user._id}?page=${page}`, {
                    withCredentials: true,
                });

                const newRecs = res.data?.recommendations || [];
                console.log("Recommendations:", newRecs);

                // If less than 5 results returned, assume no more pages
                if (newRecs.length < 5) setHasMore(false);

                // Deduplicate by _id before setting state
                setRecommendations((prev) => {
                    const combined = [...prev, ...newRecs];
                    const unique = combined.filter(
                        (item, index, self) =>
                            index === self.findIndex((t) => t._id === item._id)
                    );
                    return unique;
                });
            } catch (error) {
                console.error("Error fetching recommendations:", error);
            }
        };

        fetchRecommendations();
    }, [user, page]);


    const loadMore = () => {
        setPage((prev) => prev + 1);
    };


    if (!recommendations.length) {
        return (
            <div className="text-white bg-gray-950 p-6 rounded-xl shadow-lg mt-5 space-y-6">
                <p className="text-xl font-semibold text-gray-100">No recommendations yet</p>
                <p className="text-sm text-gray-400">Check out the Explore section to find new content and creators.</p>
    
                <Link
                    to="/explore"
                    className="inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-full transition-all duration-200 shadow-md"
                >
                    <Compass className="w-5 h-5" />
                    Go to Explore
                </Link>

                <div className="border-t border-gray-800"></div>
    
                <div className="mt-5">
                <p className="text-gray-400 text-sm mb-3">Grow your network by inviting friends</p>

                <button
                    onClick={() => setShowInviteInput((prev) => !prev)}
                    className="w-3/4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all font-semibold"
                >
                    Invite Friends
                </button>

            {showInviteInput && (
                        <div className="flex mt-3 gap-2">
                            <input
                                type="email"
                                placeholder="Enter friend's email"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                className="flex-1 px-3 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none border border-gray-700"
                            />
                            <button
                                onClick={handleInvite}
                                disabled={sending}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition"
                            >
                                {sending ? "Sending..." : "Send"}
                            </button>
                        </div>
                    )}
                </div>
    
                <div className="pt-4 border-t border-gray-800">
                    <h4 className="text-gray-200 font-semibold mb-2 text-sm uppercase tracking-wide">Trending Topics</h4>
                    <ul className="space-y-1 text-sm text-gray-400 list-disc list-inside">
                        <li>#AI</li>
                        <li>#WebDevelopment</li>
                        <li>#OpenSource</li>
                        <li>#Photography</li>
                        <li>#FitnessGoals</li>
                        <li>#ChatGPT</li>
                        <li>#DeepFakes</li>
                        <li>#InternetofThings</li>
                    </ul>
                </div>
            </div>
        );
    }    

    return (
        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-4xl ml-auto mt-5">

    <div className="mb-6 space-y-3 border-b border-gray-800 pb-6">
        <p className="text-gray-400 text-sm">Grow your network by inviting friends</p>

            <button
                onClick={() => setShowInviteInput((prev) => !prev)}
                className="w-3/4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all font-semibold"
            >
                Invite Friends
            </button>

            {showInviteInput && (
                <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="email"
                        placeholder="Enter friend's email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none border border-gray-700"
                    />
                    <button
                        onClick={handleInvite}
                        disabled={sending}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition"
                    >
                        {sending ? "Sending..." : "Send"}
                    </button>
                </div>
            )}
        </div>

            <h3 className="text-xl font-bold mb-4 whitespace-nowrap">👥 People You May Know</h3>
            <ul className="space-y-4">
                {recommendations.slice(0, page * 5).map((rec) => (
                    <li
                        key={rec._id}
                        className="flex items-center justify-between bg-gray-800 px-2 py-1 rounded-lg cursor-pointer"
                        onClick={() => navigate(`/user/profile/${rec._id}`)}
                    >
                        <div className="flex items-center gap-3">
                            <img
                                src={rec.photoUrl}
                                alt={rec.firstName}
                                className="h-10 w-10 rounded-full object-cover border"
                            />
                            <div className="flex flex-col flex-grow">
                                <p className="font-semibold whitespace-nowrap">
                                    {rec.firstName} {rec.lastName}
                                </p>
                                <p className="text-sm text-gray-400">
                                    {rec.mutualCount} mutual friend{rec.mutualCount !== 1 && "s"}
                                </p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            {hasMore && (
                <button
                    onClick={loadMore}
                    className="mt-4 w-full bg-white text-black px-3 py-2 rounded hover:bg-yellow-300 font-medium"
                >
                    Show More
                </button>
            )}
        </div>
    );
};

export default FriendRecommendations;
