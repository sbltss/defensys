import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Subscriptions from "./Table/Subscriptions";
import { getBatchSubscriptions } from "../../../../../store/api/subscription-api";
import { message } from "antd";
import BatchSubscription from "./Drawer/BatchSubscription";

const RTSubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [loading, setLoading] = useState(null);

  const fetchSubscriptionsHandler = async () => {
    setLoading(true);
    const result = await getBatchSubscriptions();
    if (result.name === "AxiosError") {
      message.error(result.response.data.message);
    } else {
      setSubscriptions(result.data);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchSubscriptionsHandler();
  }, []);

  return (
    <>
      <Helmet>
        <title>Defensys | Accounts - Batch subscriptions</title>
      </Helmet>
      <BatchSubscription
        selectedSubscription={selectedSubscription}
        onClose={() => setSelectedSubscription(null)}
        reload={fetchSubscriptionsHandler}
      />
      <div className="bg-white rounded w-full h-full shadow p-4 flex flex-col">
        <div className="border-b flex flex-row justify-between p-2">
          <span className="font-semibold text-xl">Batch subscriptions</span>
        </div>
        <div className="w-full h-full">
          <Subscriptions
            loading={loading}
            subscriptions={subscriptions}
            setSelectedSubscription={setSelectedSubscription}
          />
        </div>
      </div>
    </>
  );
};

export default RTSubscriptionsPage;
