import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Button from "../../../../UI/Button/Button";
import { PlusIcon } from "../../../../../assets/icons/Icons";
import Plans from "./Table/Plans";
import { message } from "antd";
import FormDrawer from "./Drawer/FormDrawer";
import { fetchSubscriptionPlans } from "../../../../../store/api/subscription-api";

const RTSubscriptionPlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [adding, setAdding] = useState(false);

  const fetchPlansHandler = async () => {
    const result = await fetchSubscriptionPlans();
    if (result.name === "AxiosError") {
      message.error(result.response.data.message);
    } else {
      setPlans(result.data);
    }
  };

  useEffect(() => {
    fetchPlansHandler();
  }, []);
  return (
    <>
      <Helmet>
        <title>Defensys | Accounts - Subscription Plans</title>
      </Helmet>
      <FormDrawer
        selectedPlan={selectedPlan}
        onClose={() => {
          setSelectedPlan(null);
          setAdding(false);
        }}
        setPlans={setPlans}
        adding={adding}
      />
      <div className="bg-white rounded w-full h-full shadow p-4 flex flex-col">
        <div className="border-b flex flex-row justify-between p-2">
          <span className="font-semibold text-xl">Subscription Plans</span>
          <Button
            text="Add"
            type="primary"
            Icon={PlusIcon}
            onClick={() => setAdding(true)}
          />
        </div>
        <div className="w-full h-full">
          <Plans plans={plans} setSelectedPlan={setSelectedPlan} />
        </div>
      </div>
    </>
  );
};

export default RTSubscriptionPlansPage;
