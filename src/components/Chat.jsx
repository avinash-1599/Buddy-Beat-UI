/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import { Send, X } from "lucide-react";
//import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { format } from "date-fns";
import useOnlineStatus from "../utils/customHooks/useOnlineStatus";

const Chat = ({ targetUserId, onClose, onMessageSent }) => {
  //const { targetUserId } = useParams();
  if (!targetUserId) return null;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [targetUser, setTargetUser] = useState(null);
  const onlineStatus = useOnlineStatus();

  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const firstName = user?.firstName;
  const lastName = user?.lastName;

  const fetchChatMessages = async () => {
    try {
      const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
        withCredentials: true,
      });

      const chatMessages = chat?.data?.messages.map((msg) => ({
        firstName: msg?.senderId?.firstName,
        lastName: msg?.senderId?.lastName,
        text: msg.text,
        timestamp: msg.timestamp || format(new Date(), "dd MMM yyyy, hh:mm a"),
      }));
      setMessages(chatMessages);
    } catch (err) {
      console.log("Error fetching chat messages: ", err.message);
    }
  };

  // Fetch target user details
  const fetchTargetUser = async (targetUserId) => {
    try {
      const response = await axios.get(BASE_URL+'/user/'+targetUserId, {withCredentials: true});
      setTargetUser(response?.data?.data);
    } catch (err) {
      console.error("Error fetching target user details: ", err.message);
    }
  };

  useEffect(() => {
    fetchTargetUser(targetUserId);
    fetchChatMessages();
  }, [targetUserId]);

  useEffect(() => {
    if (!userId || !targetUserId) return;

    const socket = createSocketConnection();
    socket.emit("joinChat", { firstName, lastName, userId, targetUserId });

    socket.on("receiveMessage", ({ firstName, lastName, text, timestamp }) => {
      // Check if the message is already in the state to prevent duplication
      setMessages((messages) => {
        const isMessageExist = messages.some(
          (msg) => msg.text === text && msg.timestamp === timestamp
        );
        if (!isMessageExist) {
          return [...messages, { firstName, lastName, text, timestamp }];
        }
        return messages;
      });
      onMessageSent?.(targetUserId, { text });
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId, firstName, lastName]);

  const sendMessage = () => {
    if (newMessage.trim() === "") return;
  
    const timestamp = format(new Date(), "dd MMM yyyy, hh:mm a");
  
    // Emit the message to the server
    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName,
      lastName,
      userId,
      targetUserId,
      text: newMessage,
      timestamp,
    });
  
    // Add the new message to state immediately
    const messageData = { firstName, lastName, text: newMessage, timestamp };
  
    setMessages((messages) => [...messages, messageData]);

    onMessageSent?.(targetUserId, { text: newMessage });
  
    // Clear the input after sending
    setNewMessage("");
  };
  

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-gray-900 shadow-lg rounded-lg flex flex-col h-[600px] border border-gray-800">
       {/* Chat header */}
      <div className="flex items-center justify-between p-1 bg-gradient-to-r from-violet-500 to-green-300 rounded-t-lg shadow-md">
        <div className="flex items-center space-x-3">
        <div className="relative w-10 h-10">
          {/* User Avatar / Initials */}
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-teal-600 font-semibold text-xl">
            <span>{targetUser?.firstName?.[0]}{targetUser?.lastName?.[0]}</span>
          </div>

          {/* Online/Offline Status Dot */}
          <div
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white 
              ${onlineStatus ? "bg-green-500" : "bg-red-500"}`}
          ></div>
        </div>
          <h3 className="text-white text-xl font-medium">{targetUser?.firstName} {targetUser?.lastName}</h3>
        </div>

        <button
          onClick={onClose}
          className="text-black hover:text-red-500 transition duration-200 ease-in-out"
        >
          <X size={20} />
        </button>
      </div>

       {/* Chat Messages */}
       <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-800 text-white">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.firstName === user.firstName ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`relative max-w-[75%] px-4 py-3 rounded-2xl shadow-lg ${
                msg.firstName === user.firstName
                  ? "bg-teal-500 text-white rounded-br-none"
                  : "bg-purple-500 text-white rounded-bl-none"
              }`}
            >
              <div className="text-sm font-semibold text-black">{msg.firstName}</div>
              <div className="mt-1 text-base">{msg.text}</div>
              <div className="text-xs text-gray-200 text-right mt-1">
                {msg.timestamp}
              </div>

              {/* Chat Bubble Tail */}
              <div
                className={`absolute bottom-0 w-3 h-3 bg-inherit ${
                  msg.firstName === user.firstName
                    ? "right-[-6px] rounded-br-full"
                    : "left-[-6px] rounded-bl-full"
                }`}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="flex items-center p-4 bg-gray-900 border-t border-gray-700">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 p-3 rounded-full bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
        <button
          onClick={sendMessage}
          className="ml-3 p-3 rounded-full bg-teal-500 text-white hover:bg-teal-600 transition duration-200"
        >
          <Send className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default Chat;