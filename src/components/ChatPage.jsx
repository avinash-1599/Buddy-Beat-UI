import { useEffect, useState } from "react";
import axios from "axios";
import Chat from "./Chat";
import { BASE_URL } from "../utils/constants";

const ChatPage = () => {
  const [chats, setChats] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [setSelectedUser] = useState(null);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const res = await axios.get(BASE_URL + "/chats", { withCredentials: true });
      setChats(res.data);
    } catch (err) {
      console.error("Error fetching chats:", err);
    }
  };

  const handleUserClick = (chat) => {
    setSelectedUserId(chat.participant._id);
    setSelectedUser(chat.participant);
  };

  const moveChatToTop = (targetUserId, lastMessage) => {
    setChats(prevChats => {
      const updatedChats = prevChats.filter(chat => chat.participant?._id !== targetUserId);
      const chatToMove = prevChats.find(chat => chat.participant?._id === targetUserId);
  
      if (chatToMove) {
        chatToMove.lastMessage = lastMessage;
        return [chatToMove, ...updatedChats];
      }
  
      // If not found (possibly first message), add new one
      return [{
        _id: Date.now(), // temp ID
        participant: { _id: targetUserId }, // you can enhance this
        lastMessage,
      }, ...prevChats];
    });
  };  

  return (
    <div className="flex h-[calc(100vh-90px)] pt-4">
      {/* Left Side - Users */}
      <div className="w-1/4 border-r overflow-y-auto bg-gray-900">
      <h2 className="text-xl font-bold px-4 py-2 border-b text-gray-400">Chats</h2>
        {chats.length === 0 ? (
          <div className="p-4 text-gray-500">No chats yet</div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => handleUserClick(chat)}
              className={`p-4 cursor-pointer hover:bg-gray-200 ${
                selectedUserId === chat.participant?._id ? "bg-gray-300" : ""
              }`}
            >
              <p className="font-medium text-white">
                {chat.participant?.firstName} {chat.participant?.lastName}
              </p>
              <p className="text-gray-500 text-sm truncate">{chat.lastMessage?.text || "No messages yet"}</p>
            </div>
          ))
        )}
      </div>

      {/* Right Side - Chat Window */}
      <div className="w-3/4 flex flex-col items-center justify-center bg-gray-800">
        {selectedUserId ? (
          <Chat targetUserId={selectedUserId} onClose={() => setSelectedUserId(null)} onMessageSent={moveChatToTop} />
        ) : (
          <div className="text-gray-500 text-lg">Select a chat to start messaging</div>
        )}
      </div>
    </div>
  );
}

export default ChatPage;