import React from "react";
import { useSelector } from "react-redux";
import ChatItems from "./ChatItems/ChatItems";
import Header from "./Header";
import NewChat from "./NewChat/NewChat";

const Chat = () => {
  const { chats, selectedChatTicket, fetchChatsLoading, sendChatLoading } =
    useSelector((state) => state.chat);
  return (
    <div className="z-[100000] bg-white w-80 h-[450px] border-2 shadow-lg fixed bottom-0 right-10 rounded-t-xl flex flex-col">
      <Header selectedChatTicket={selectedChatTicket} />
      <ChatItems chats={chats} fetchChatsLoading={fetchChatsLoading} />
      <NewChat
        sendChatLoading={sendChatLoading}
        selectedChatTicket={selectedChatTicket}
      />
    </div>
  );
};

export default Chat;
