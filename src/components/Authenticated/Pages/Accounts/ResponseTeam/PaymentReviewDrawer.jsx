import { Descriptions, Drawer, Image, Input, Modal, message } from "antd";
import moment from "moment";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../../../UI/Button/Button";
import {
  approveRtPayment,
  rejectRtPayment,
} from "../../../../../store/api/adminFn-api";
import { useState } from "react";
import { resourcesActions } from "../../../../../store/store";

const { updateRtPayment } = resourcesActions;

const PaymentReviewDrawer = ({ paymentReview, onClose }) => {
  const dispatch = useDispatch();
  const { commandCenters } = useSelector((state) => state.resources);
  const [mode, setMode] = useState(null);
  const [remarks, setRemarks] = useState("");

  const verifyHandler = async () => {
    let result;
    const payload = {
      body: { remarks },
      param: paymentReview?.latestPaymentLog?.paymentId,
    };
    if (mode === "reject") {
      result = await rejectRtPayment(payload);
    } else {
      result = await approveRtPayment(payload);
    }
    if (result.name === "AxiosError") {
      message.error(result.response.data.message);
    } else {
      dispatch(updateRtPayment(result.data.data));
      setMode(null);
      setRemarks("");
      onClose();
      message.success(result.data.message);
    }
  };

  return (
    <Drawer
      height={"80vh"}
      placement="bottom"
      title="Payment Review"
      open={!!paymentReview}
      onClose={onClose}
      footer={
        <div className="flex flex-row justify-end items-center gap-1">
          <Button
            type="danger"
            text="Reject"
            onClick={() => setMode("reject")}
          />
          <Button
            type="primary"
            text="Approve"
            onClick={() => setMode("approve")}
          />
        </div>
      }
    >
      <Modal
        onOk={verifyHandler}
        open={!!mode}
        onCancel={() => setMode(null)}
        title={mode === "reject" ? "Reject payment" : "Approve payment"}
      >
        <Input
          placeholder="Input your remarks"
          onChange={(e) => setRemarks(e.target.value)}
        />
      </Modal>
      <Descriptions
        title={"Response team details"}
        bordered
        size="small"
        column={1}
        className="max-w-[900px] mb-8"
      >
        <Descriptions.Item label={"Responder Name"}>
          {[paymentReview?.firstName, paymentReview?.lastName].join(" ")}
        </Descriptions.Item>
        <Descriptions.Item label={"Type"}>
          {paymentReview?.type}
        </Descriptions.Item>
        <Descriptions.Item label={"Contact Number"}>
          {paymentReview?.contactNumber}
        </Descriptions.Item>
        <Descriptions.Item label={"Plate Number"}>
          {paymentReview?.plateNumber}
        </Descriptions.Item>
        <Descriptions.Item label={"Department"}>
          {paymentReview?.departmentName}
        </Descriptions.Item>
        <Descriptions.Item label={"Command Center"}>
          {
            commandCenters.find(
              (cc) => cc.commandCenterId === paymentReview?.commandCenterId
            )?.name
          }
        </Descriptions.Item>
      </Descriptions>

      <Descriptions
        title={"Payment details"}
        bordered
        size="small"
        column={1}
        className="max-w-[900px]"
      >
        <Descriptions.Item label={"Date time sent"}>
          {moment(paymentReview?.latestPaymentLog?.dateCreated).format("LLL")}
        </Descriptions.Item>
        <Descriptions.Item label={"Selected plan"}>
          {paymentReview?.latestPaymentLog?.description}
        </Descriptions.Item>
        <Descriptions.Item label={"Proof of payment"}>
          <Image
            className="max-h-36"
            src={[
              import.meta.env.VITE_BASE_URL,
              "/",
              paymentReview?.latestPaymentLog?.paymentImageUrl,
            ].join("")}
            alt="Proof of payment"
          />
        </Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
};

export default PaymentReviewDrawer;
