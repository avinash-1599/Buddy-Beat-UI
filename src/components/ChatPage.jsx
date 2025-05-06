import { useEffect, useState } from "react";
import axios from "axios";
import Chat from "./Chat";
import { BASE_URL } from "../utils/constants";

const ChatPage = () => {
  const [chats, setChats] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  // Filter connections based on search term
  const filteredChats = chats.filter(chat => {
    const fullName = `${chat?.participant?.firstName} ${chat?.participant?.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
});

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
      {/* <h2 className="text-xl font-bold px-4 py-2 border-b text-gray-400">Chats</h2> */}
      <div className="sticky top-0 z-10 bg-gray-900 px-4 py-3 border-b border-gray-700 flex items-center justify-between gap-4">
        <h1 className="text-xl font-bold text-white">Chats</h1>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name..."
          className="w-full max-w-[180px] h-8 px-3 py-1.5 bg-gray-800 text-white placeholder-gray-400 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
        {chats.length === 0 ? (
          <div className="p-4 text-gray-500">No chats yet</div>
        ) : (
          filteredChats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => handleUserClick(chat)}
              className={`p-4 cursor-pointer hover:bg-gray-700 ${
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
      <div className="w-3/4 flex flex-col items-center justify-center bg-gray-700">
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