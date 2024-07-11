import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { cctvActions } from "../../../../store/store";
import CCTVTable from "./Tables/CCTVTable";
const { fetchCctv } = cctvActions;

const CCTVPage = () => {
  const dispatch = useDispatch();

  const { cctvList, fetchCctvLoading } = useSelector((state) => state.cctv);

  useEffect(() => {
    dispatch(fetchCctv());
  }, []);

  return (
    <>
      <Helmet>
        <title>Defensys | Accounts - CCTVs</title>
      </Helmet>
      <div className="bg-white rounded w-full shadow p-4 flex flex-col">
        <div className="border-b flex flex-row justify-between p-2">
          <span className="font-semibold text-xl">CCTV</span>
        </div>
        <div className="w-full h-full">
          <CCTVTable fetchCctvLoading={fetchCctvLoading} cctvList={cctvList} />
        </div>
      </div>
    </>
  );
};

export default CCTVPage;
