import React, { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { format } from "date-fns";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const firstName = user?.firstName;
  const lastName = user?.lastName;


  const fetchChatMessages = async () => {
    try {
      const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
        withCredentials: true,
      });
      console.log("Chat: ", chat.data.messages);

      const chatMessages = chat?.data?.messages.map(msg => {
        return {
            firstName: msg?.senderId?.firstName, 
            lastName: msg?.senderId?.lastName, 
            text: msg.text
        }
      })
      setMessages(chatMessages);
    } catch (err) {
      console.log("Error fetching chat messages: ", err.message)
      }
    };

useEffect(() => {
    fetchChatMessages();
    }, []);

  useEffect(() => {
    if(!userId || !targetUserId) return;

    const socket = createSocketConnection();
    socket.emit("joinChat", { firstName, lastName, userId, targetUserId})

    socket.on("receiveMessage", ({firstName, lastName, text, timestamp}) => {
        console.log('Message received: ', firstName, lastName, text, timestamp);
        setMessages((messages) => [...messages, {firstName, lastName, text, timestamp}]);
    });

    return ()=> {
        socket.disconnect();
    }
  }, [userId, targetUserId]);

  const sendMessage = () => {
    if (newMessage.trim() === "") return;
    const socket = createSocketConnection();
    socket.emit("sendMessage", {firstName, lastName, userId, targetUserId, text: newMessage, timestamp: format(new Date(), "dd MMM yyyy, hh:mm a")});
    setNewMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto border-4 border-blue-500 rounded shadow-md flex flex-col h-[500px]">
      {/* Chat Messages */}
      <h1 className="p-2 border-b border-gray-600">Chat</h1>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => {
        return (<div key={index} className={`chat ${msg.firstName === user.firstName ? "chat-end" : "chat-start"}`}>
            <div className="chat-header">
              {msg.firstName+" "+msg.lastName}
              <time className="text-xs opacity-50"> {msg.timestamp}</time>
            </div>
            <div className="chat-bubble">{msg.text}</div>
            <div className="chat-footer opacity-50">Seen</div>
          </div>)})
        }
      </div>

      {/* Input Box */}
      <div className="flex items-center p-4 border-t border-blue-500">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 p-2 border rounded-md focus:outline-none"
        />
        <button
          onClick={sendMessage}
          className="ml-2 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Chat;
