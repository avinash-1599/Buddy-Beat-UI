import { Outlet, useNavigate, useLocation } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useEffect } from "react";
import { motion } from "framer-motion";

const animatedTexts = [
    { text: "Welcome!", top: "15%", left: "7%", color: "text-purple-400" },
    { text: "Connect, Share and Vibe !", top: "25%", left: "70%", color: "text-blue-400" },
    { text: "🙋‍♂️🙋‍♀️", top: "45%", left: "80%", color: "text-blue-400" },
    { text: "To", top: "25%", left: "15%", color: "text-yellow-300" },
    { text: "BuddyBeat", top: "35%", left: "8%", color: "text-pink-500" },
];

const floatingParticles = Array.from({ length: 10 }).map((_, i) => ({
    id: i,
    size: Math.random() * 10 + 5, // Random size between 5px and 15px
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
}));

const Body = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const userData = useSelector(store => store.user);

    const fetchUser = async () => {
        if (userData) return;
        try {
            const res = await axios.get(BASE_URL + "/profile/view", { withCredentials: true });
            dispatch(addUser(res.data.data));
        } catch (err) {
            if (err.response && err.response.status === 401) {
                navigate("/login");
            }
            console.log(err);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const isLoginPage = location.pathname === "/login";

    return (
        <div className="min-h-screen flex flex-col relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
            <NavBar />
            <main className="flex-grow relative flex items-center justify-center overflow-hidden mt-[-50px] z-0">
                {/* Floating Animated Texts */}
                {isLoginPage && (
                    <div className="absolute inset-0">
                        {animatedTexts.map((item, index) => (
                            <motion.div
                                key={index}
                                className={`absolute text-5xl font-extrabold drop-shadow-lg ${item.color}`}
                                style={{ top: item.top, left: item.left, zIndex: 10 }}
                                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                                animate={{ opacity: 1, y: [0, -30, 30, 0], scale: [1, 1.1, 1] }}
                                transition={{
                                    duration: 6,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    ease: "easeInOut",
                                }}
                            >
                                {item.text}
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Floating Particles */}
                {isLoginPage && (
                    <div className="absolute inset-0">
                        {floatingParticles.map((particle) => (
                            <motion.div
                                key={particle.id}
                                className="absolute bg-white rounded-full opacity-30 blur-lg"
                                style={{
                                    width: `${particle.size}px`,
                                    height: `${particle.size}px`,
                                    top: particle.top,
                                    left: particle.left,
                                }}
                                animate={{
                                    y: [0, -20, 20, 0],
                                    x: [0, -10, 10, 0],
                                    opacity: [0.3, 0.6, 0.3],
                                }}
                                transition={{
                                    duration: Math.random() * 5 + 3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Glassmorphism Login Form */}
                {/* <div className="p-10 rounded-2xl min-w-[350px] relative z-20"> */}
                {/* <div className="w-full py-6">
                    <Outlet />
                </div> */}
                 {/* ✅ Full height, no external scroll */}
                <div className="w-full">
                <Outlet />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Body;