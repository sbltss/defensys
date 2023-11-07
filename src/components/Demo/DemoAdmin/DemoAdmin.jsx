import { Wrapper } from "@googlemaps/react-wrapper";
import React from "react";
import MainLayout from "../../UI/Layout/MainLayout";
import routes from "../../../routes";
import { useSelector } from "react-redux";

const DemoAdmin = () => {
  const { currentUser } = useSelector((state) => state.auth);
  return (
    <div className="relative h-screen w-screen ">
      <div className="absolute t-0 w-full bg-primary-800 py-1 text-center">
        <span className="text-white font-semibold">Demo Admin</span>
      </div>
      <div className="h-screen w-screen pt-8">
        <Wrapper
          libraries={["geometry", "places", "visualization"]}
          apiKey={import.meta.env.VITE_GOOGLE_API}
        >
          <MainLayout routes={routes?.[currentUser.accountType] || []} />
        </Wrapper>
      </div>
    </div>
  );
};

export default DemoAdmin;
