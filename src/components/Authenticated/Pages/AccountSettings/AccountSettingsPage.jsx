import React from "react";
import { Helmet } from "react-helmet";
import CommandCenterSection from "./CommandCenterSection";
import ProfileSection from "./ProfileSection";
import CredentialsSection from "./CredentialsSection";

const AccountSettingsPage = () => {
  return (
    <>
      <Helmet>
        <title>Defensys | Account Settings</title>
      </Helmet>
      <div className="bg-white rounded w-full shadow  p-4 flex flex-col">
        <div className="border-b flex flex-row justify-between p-2">
          <span className="font-semibold text-xl">Account Settings</span>
        </div>
        <div className="w-full h-full flex flex-col gap-2 ">
          <CommandCenterSection />
          <ProfileSection />
          <CredentialsSection />
        </div>
      </div>
    </>
  );
};

export default AccountSettingsPage;
