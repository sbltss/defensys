import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Button from "../../../../UI/Button/Button";
import { PlusIcon } from "../../../../../assets/icons/Icons";
import { message } from "antd";
import { getBatchSubscriptions } from "../../../../../store/api/subscription-api";
import Subscriptions from "./Table/Subscriptions";
import BatchSubscriptionForm from "./Drawer/BatchSubscriptionForm";

const DeptBatchSubscriptionPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [adding, setAdding] = useState(false);

  const fetchSubscriptionsHandler = async () => {
    const result = await getBatchSubscriptions();
    if (result.name === "AxiosError") {
      message.error(result.response.data.message);
    } else {
      setSubscriptions(result.data);
    }
  };
  useEffect(() => {
    fetchSubscriptionsHandler();
  }, []);
  return (
    <>
      <Helmet>
        <title>Defensys | Accounts - Batch Subscription</title>
      </Helmet>
      <BatchSubscriptionForm
        open={adding}
        onClose={() => setAdding(false)}
        reload={fetchSubscriptionsHandler}
      />
      <div className="bg-white rounded w-full h-full shadow p-4 flex flex-col">
        <div className="border-b flex flex-row justify-between p-2">
          <span className="font-semibold text-xl">Batch Subscription</span>
          <Button
            text="Add"
            type="primary"
            Icon={PlusIcon}
            onClick={() => setAdding(true)}
          />
        </div>
        <div className="w-full h-full">
          <Subscriptions subscriptions={subscriptions} />
        </div>
      </div>
    </>
  );
};

export default DeptBatchSubscriptionPage;
