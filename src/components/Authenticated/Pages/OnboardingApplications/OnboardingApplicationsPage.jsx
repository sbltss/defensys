import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Applicants from "./Table/Applicants";
import Applicant from "./Drawers/Applicant";
import { message } from "antd";
import { getApplicants } from "../../../../store/api/adminFn-api";

const OnboardingApplicationsPage = () => {
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchApplicantHandler = async () => {
    setLoading(true);
    const result = await getApplicants();
    if (result.name === "AxiosError") {
      message.error(result.response.data.message);
    } else {
      setApplicants(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApplicantHandler();
  }, []);

  return (
    <>
      <Helmet>
        <title>Defensys | Accounts - Onboarding Applications</title>
      </Helmet>
      <Applicant
        onClose={() => setSelectedApplicant(null)}
        selectedApplicant={selectedApplicant}
        reload={fetchApplicantHandler}
      />
      <div className="bg-white rounded w-full h-full shadow p-4 flex flex-col">
        <div className="border-b flex flex-row justify-between p-2">
          <span className="font-semibold text-xl">Onboarding Applications</span>
        </div>
        <div className="w-full h-full">
          <Applicants
            applicants={applicants}
            loading={loading}
            selectApplicant={setSelectedApplicant}
          />
        </div>
      </div>
    </>
  );
};

export default OnboardingApplicationsPage;
