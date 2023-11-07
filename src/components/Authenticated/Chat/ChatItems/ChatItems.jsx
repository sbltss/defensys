import moment from "moment";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import ChatItem from "./ChatItem";

const ChatItems = ({ fetchChatsLoading, chats }) => {
  const { currentUser } = useSelector((state) => state.auth);
  const scrollDiv = useRef(null);
  useEffect(() => {
    if (scrollDiv) {
      scrollDiv.current.addEventListener("DOMNodeInserted", (event) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight + 9999, behavior: "smooth" });
      });
    }
  }, []);

  const scrollOnImageLoad = () => {
    const target = scrollDiv.current;
    target.scroll({ top: target.scrollHeight + 9999, behavior: "smooth" });
  };

  return (
    <div
      className="flex flex-1 flex-col gap-2 px-2 overflow-y-auto"
      ref={scrollDiv}
    >
      {fetchChatsLoading && (
        <span className="my-auto text-center text-sm text-gray-500">
          Loading conversation...
        </span>
      )}
      {!fetchChatsLoading && chats.length === 0 && (
        <span className="my-auto text-center text-sm text-gray-500">
          Start a conversation
        </span>
      )}
      {!fetchChatsLoading &&
        chats.map((chat, index) => {
          const pos = currentUser.accountId === chat.sender ? "right" : "left";
          return (
            <div key={chat.id}>
              {(moment([...chats][index + 1]?.dateCreated).diff(
                moment(chat.dateCreated),
                "minutes"
              ) > 10 ||
                index === 0) && (
                <div className="w-full flex flex-row justify-center">
                  <span className="text-xs text-gray-500 text-center">
                    {moment(chat.dateCreated).format("lll")}
                  </span>
                </div>
              )}
              <ChatItem
                position={pos}
                chat={chat}
                scrollOnImageLoad={scrollOnImageLoad}
              />
            </div>
          );
        })}
    </div>
  );
};

export default ChatItems;
