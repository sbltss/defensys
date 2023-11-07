import React from "react";
import InfoItem from "./InfoItem";
import { useSelector } from "react-redux";
import LogoItem from "./LogoItem";

const CommandCenterSection = () => {
  const {
    currentUser: { commandCenterName, address, logoUrl },
  } = useSelector((state) => state.auth);
  return (
    <div className="flex flex-col gap-2">
      <div className="bg-gray-200 rounded-lg py-2 px-4 font-medium">
        Command Center
      </div>
      <div className="flex flex-col gap-6">
        <InfoItem field="Name" value={commandCenterName} />
        <InfoItem field="Address" value={address} />
        <LogoItem value={logoUrl} field={"Logo"} editable />
      </div>
    </div>
  );
};

export default CommandCenterSection;
