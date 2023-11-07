import { Drawer, Form, Image, Input, Select, Upload, message } from "antd";
import React, { useEffect, useState } from "react";
import {
  addBatchSubscriptions,
  fetchSubscriptionPlans,
} from "../../../../../../store/api/subscription-api";
import ResponderSelection from "../Table/ResponderSelection";
import ResponseTeamsDrawer from "./ResponseTeamsDrawer";
import Button from "../../../../../UI/Button/Button";
import { InboxOutlined } from "@ant-design/icons";
import { getBase64 } from "../../../../../../helpers/base64";
import { useDispatch } from "react-redux";
const { Dragger } = Upload;

const BatchSubscriptionForm = ({ open, onClose, reload }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [selectedResponders, setSelectedResponders] = useState([]);
  const [selectingResponders, setSelectingResponders] = useState(false);
  const [proofOfPayment, setProofOfPayment] = useState(null);
  const [preview, setPreview] = useState(null);

  const fetchPlans = async () => {
    const result = await fetchSubscriptionPlans();
    if (result.name === "AxiosError") {
      message.error(result.response.data.message);
    } else {
      setPlans(result.data);
    }
  };

  const selectedPlan = Form.useWatch("planId", form);

  useEffect(() => {
    if (!plans.find((e) => e.planId === selectedPlan))
      form.setFieldValue("totalRate", "Select subscription plan");
    else if (selectedResponders.length === 0)
      form.setFieldValue("totalRate", "Select responders");
    else {
      form.setFieldValue(
        "totalRate",
        `${
          selectedResponders.length *
          plans.find((e) => e.planId === selectedPlan)?.rate
        } PHP`
      );
    }
  }, [selectedPlan, selectedResponders.length]);

  useEffect(() => {
    fetchPlans();
  }, []);

  const onFinishHandler = async (e) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("planId", e.planId);
    formData.append("responders", selectedResponders.join(";;;"));
    formData.append("payment", proofOfPayment);

    const result = await addBatchSubscriptions({ body: formData });
    if (result.name === "AxiosError") {
      message.error(result.response.data.message);
    } else {
      form.setFieldsValue({
        planId: null,
      });
      setPreview(null);
      setProofOfPayment(null);
      setSelectedResponders([]);
      onClose();
      message.success(result.data.message);
      reload();
    }
    setLoading(false);
  };

  return (
    <Drawer
      open={open}
      onClose={() => {
        form.setFieldsValue({
          planId: null,
        });
        setPreview(null);
        setProofOfPayment(null);
        setSelectedResponders([]);
        onClose();
      }}
      placement="bottom"
      height={"80vh"}
      title="Batch Subscription"
      footer={
        <div className="flex items-center justify-end">
          <Button
            text="Submit"
            type="primary"
            disabled={
              !selectedPlan ||
              selectedResponders.length === 0 ||
              !proofOfPayment
            }
            onClick={form.submit}
            loading={loading}
          />
        </div>
      }
    >
      <ResponseTeamsDrawer
        open={selectingResponders}
        onClose={() => setSelectingResponders(false)}
        selectedResponders={selectedResponders}
        setSelectedResponders={setSelectedResponders}
      />
      <div className="w-full flex flex-row gap-8">
        <div className="w-1/2">
          <Form
            form={form}
            onFinish={onFinishHandler}
            requiredMark="optional"
            layout="vertical"
          >
            <Form.Item
              name="planId"
              label="Selected Plan"
              rules={[
                {
                  required: true,
                  message: "Please select subscription plan",
                },
              ]}
            >
              <Select placeholder="Please select subscription plan">
                {plans.map((plan) => (
                  <Select.Option key={plan.planId} value={plan.planId}>
                    {`${plan.description} - ${plan.rate} PHP per responder`}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="totalRate"
              label="Estimated Cost"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input readOnly />
            </Form.Item>
            <Form.Item required="true" label="Proof of payment">
              {proofOfPayment ? (
                <div className="flex flex-col justify-center gap-4 items-start">
                  <Image width={200} src={preview} />
                  <Button
                    type="muted"
                    text="Remove"
                    onClick={(e) => {
                      setProofOfPayment(null);
                      setPreview(null);
                    }}
                    disabled={loading}
                  />
                </div>
              ) : (
                <Dragger
                  accept="image/*"
                  name="proof"
                  multiple={false}
                  beforeUpload={async (file) => {
                    setProofOfPayment(file);
                    const base64 = await getBase64(file);
                    setPreview(base64);
                  }}
                  onChange={(info) => {
                    const { status } = info.file;

                    if (status !== "uploading") {
                    }

                    if (status === "done") {
                      message.success(
                        `${info.file.name} file uploaded successfully.`
                      );
                    } else if (status === "error") {
                      message.error(`${info.file.name} file upload failed.`);
                    }
                  }}
                  onDrop={(e) => {}}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to this area to upload
                  </p>
                  <p className="ant-upload-hint">
                    Please submit an image containing your payment confirmation
                    as proof.
                  </p>
                </Dragger>
              )}
            </Form.Item>
          </Form>
        </div>
        <div className="w-1/2">
          <div className="w-full flex justify-between items-center">
            <span>Selected Responders</span>
            <Button
              type="primary"
              text="Add Responders"
              onClick={() => setSelectingResponders(true)}
              disabled={loading}
            />
          </div>
          <ResponderSelection
            isSelectedList={true}
            selectedResponders={selectedResponders}
            setSelectedResponders={setSelectedResponders}
            disabled={loading}
          />
        </div>
      </div>
    </Drawer>
  );
};

export default BatchSubscriptionForm;
