import React from "react";
import { Helmet } from "react-helmet";
import Logs from "./Table/Logs";

const CallLogsPage = () => {
  return (
    <>
      <Helmet>
        <title>Defensys | Accounts - Call Logs</title>
      </Helmet>
      <div className="bg-white rounded w-full h-full shadow p-4 flex flex-col">
        <div className="border-b flex flex-row justify-between p-2">
          <span className="font-semibold text-xl">Call Logs</span>
        </div>
        <div className="w-full h-full">
          <Logs />
        </div>
      </div>
    </>
  );
};

export default CallLogsPage;
