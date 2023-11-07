import React from "react";
import { Badge } from "antd";

const NotificationButton = ({ Icon, count, setNotifOpen, type, notifOpen }) => {
  return (
    <Badge
      size="small"
      count={count}
      offset={[-5, 5]}
      status="warning"
      className="flex flex-row items-center"
      onClick={() => {
        if (notifOpen === type) setNotifOpen(null);
        else setNotifOpen(type);
      }}
    >
      <button className="overflow-hidden p-2 bg-primary-800 leading-none rounded-full hover:bg-primary-900 duration-300">
        <Icon className="text-gray-100 hover:text-white" />
      </button>
    </Badge>
  );
};

export default NotificationButton;
