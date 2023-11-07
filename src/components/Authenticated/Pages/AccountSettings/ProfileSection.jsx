import React from "react";
import InfoItem from "./InfoItem";
import { useSelector } from "react-redux";

const ProfileSection = () => {
  const {
    currentUser: { accountType, email, firstName, lastName, contactNumber },
  } = useSelector((state) => state.auth);
  return (
    <div className="flex flex-col gap-2">
      <div className="bg-gray-200 rounded-lg py-2 px-4 font-medium">
        Profile
      </div>
      <div className="flex flex-col gap-6">
        <InfoItem field="Name" value={[firstName, lastName].join(" ")} />
        <InfoItem field="Contact Number" value={contactNumber} />
        <InfoItem field="Email" value={email} />
        <InfoItem field="Account Type" value={accountType.toUpperCase()} />
      </div>
    </div>
  );
};

export default ProfileSection;
