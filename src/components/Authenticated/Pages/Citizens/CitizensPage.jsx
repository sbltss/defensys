import React from "react";
import { useState } from "react";
import { Helmet } from "react-helmet";
import CitizenTable from "./CitizenTable";
import SearchCitizenForm from "./SearchCitizenForm";

const CitizensPage = () => {
  const [citizens, setCitizens] = useState([]);
  const [loading, setLoading] = useState(false);
  return (
    <>
      <Helmet>
        <title>Defensys - Citizens</title>
      </Helmet>
      <div className="bg-white rounded w-full shadow p-4 flex flex-col overflow-y-auto">
        <div className="w-full h-full flex flex-col gap-3">
          <div className="border-b flex flex-row justify-between p-2">
            <span className="font-semibold text-xl">Search Citizens</span>
          </div>
          <SearchCitizenForm
            setCitizens={setCitizens}
            setLoading={setLoading}
            loading={loading}
          />

          <div className="border-b flex flex-row justify-between p-2">
            <span className="font-semibold text-xl">Result</span>
          </div>
          <CitizenTable citizens={citizens} loading={loading} />
        </div>
      </div>
    </>
  );
};

export default CitizensPage;
