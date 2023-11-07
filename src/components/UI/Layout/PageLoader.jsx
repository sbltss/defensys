import React from "react";
import { ThreeDots } from "react-loader-spinner";

const PageLoader = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <ThreeDots
        height="80"
        width="80"
        radius="9"
        color="#1e40af"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClassName=""
        visible={true}
      />
    </div>
  );
};

export default PageLoader;
