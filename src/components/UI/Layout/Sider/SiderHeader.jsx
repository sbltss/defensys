import React from "react";
import logo from "../../../../assets/img/logo/logo.png";
import { useSelector } from "react-redux";

const SiderHeader = ({ collapsed }) => {
  const { currentUser } = useSelector((state) => state.auth);
  return (
    <div className="flex items-center pt-2">
      <img
        src={
          currentUser.logoUrl
            ? [import.meta.env.VITE_BASE_URL, "/", currentUser.logoUrl].join("")
            : logo
        }
        alt="logo"
        className={!collapsed ? "p-3 w-2/5" : "p-2 w-full"}
      />
      {!collapsed && (
        <span className="text-gray-900 font-semibold text-base leading-snug capitalize">
          {[
            currentUser?.accountType === "agent"
              ? "Dispatcher"
              : currentUser?.accountType,
            currentUser?.commandCenterName,
          ].join(" ")}
        </span>
      )}
    </div>
  );
};

export default SiderHeader;
