import { Drawer, Form, Input, InputNumber, message } from "antd";
import React, { useEffect } from "react";
import Button from "../../../../../UI/Button/Button";
import { useState } from "react";
import {
  addPlan,
  updatePlan,
} from "../../../../../../store/api/subscription-api";

const FormDrawer = ({ selectedPlan, onClose, setPlans, adding }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedPlan) {
      form.setFieldsValue(selectedPlan);
    } else form.resetFields();
  }, [selectedPlan]);

  const onFinish = async (e) => {
    setLoading(true);
    let result;
    if (selectedPlan) {
      result = await updatePlan({ body: e, param: selectedPlan.planId });
    } else {
      result = await addPlan({ body: e });
    }

    if (result.name === "AxiosError") {
      message.error(result.response.data.message);
    } else {
      if (selectedPlan)
        setPlans((prevState) =>
          prevState.map((p) => {
            if (p.planId === selectedPlan.planId)
              return { ...p, ...result.data.data };
            return { ...p };
          })
        );
      else setPlans((prevState) => [...prevState, result.data.data]);

      message.success(result.data.message);
      form.resetFields();
      onClose();
    }

    setLoading(false);
  };

  return (
    <Drawer
      title="Subscription Plan"
      placement="right"
      open={!!selectedPlan || adding}
      onClose={onClose}
      footer={
        <div className="flex flex-row justify-end items-center">
          <Button
            type="primary"
            text="Submit"
            onClick={form.submit}
            loading={loading}
          />
        </div>
      }
    >
      <div className="max-w-[900px]">
        <Form
          disabled={loading}
          requiredMark="optional"
          className=""
          form={form}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name={"numOfMonths"}
            label="Number of months"
            rules={[
              {
                required: true,
                message: "Input number of months for this plan",
              },
            ]}
          >
            <InputNumber className="w-full" step={0.5} min={0.5} />
          </Form.Item>

          <Form.Item
            name={"rate"}
            label="Rate per responder"
            rules={[
              {
                required: true,
                message: "Input rate for this plan",
              },
            ]}
          >
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item
            name={"description"}
            label="Description"
            rules={[
              {
                required: true,
                message: "Input number of description for this plan",
              },
            ]}
          >
            <Input className="w-full" />
          </Form.Item>
        </Form>
      </div>
    </Drawer>
  );
};

export default FormDrawer;
