import { Image, Tooltip } from "antd";
import moment from "moment";
import React from "react";

const ChatItem = ({ position = "left", chat, scrollOnImageLoad }) => {
  const { msgType, content, constituentName, deptName, rtName, agentName } =
    chat;
  const className = "rounded-2xl p-2 max-w-[260px] text-sm ";
  const pos = position === "left" ? "justify-start " : "justify-end ";
  return (
    <div>
      {position === "left" && (
        <span className="text-xs font-regular">
          {rtName
            ? `${rtName}(Response Team)`
            : deptName
            ? `${deptName}(Department)`
            : agentName
            ? `${agentName}(Dispatcher)`
            : constituentName}
        </span>
      )}
      <div className={"flex flex-row " + pos}>
        {position === "left" && (
          <Tooltip
            title={moment(chat.dateCreated).format("lll")}
            placement={position}
          >
            {msgType === "msg" && (
              <div className={className + "bg-gray-300"}>
                <p className="w-full break-words">{content}</p>
              </div>
            )}
            {msgType === "img" && (
              <Image
                preview={false}
                crossOrigin="same-site"
                onLoad={scrollOnImageLoad}
                className="max-w-[200px] rounded-2xl"
                src={import.meta.env.VITE_BASE_URL + "/" + content}
              />
            )}
          </Tooltip>
        )}
        {position === "right" && (
          <Tooltip
            title={moment(chat.dateCreated).format("lll")}
            placement={position}
          >
            {msgType === "msg" && (
              <div className={className + "bg-primary-700 text-white "}>
                <p className="w-full break-words">{content}</p>
              </div>
            )}
            {msgType === "img" && (
              <Image
                crossOrigin="same-site"
                onLoad={scrollOnImageLoad}
                className="max-w-[200px] rounded-2xl"
                src={import.meta.env.VITE_BASE_URL + "/" + content}
              />
            )}
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default ChatItem;
