import { Form, Input, message } from "antd";
import React, { useState } from "react";
import Button from "../../../UI/Button/Button";
import { changePasswordWithTokenV2 } from "../../../../store/api/auth-api";

const CredentialsSection = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const onFinishHandler = async ({ confirmPassword, ...body }) => {
    setLoading(true);
    const request = await changePasswordWithTokenV2({ body });
    setLoading(false);
    if (request.name === "AxiosError") {
      message.error(request.response.data.message);
    } else {
      message.success(request.data.message);
      form.resetFields();
    }
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="bg-gray-200 rounded-lg py-2 px-4 font-medium">
        Command Center
      </div>
      <div className="flex flex-col gap-6 max-w-md">
        <Form
          layout="vertical"
          form={form}
          requiredMark="optional"
          onFinish={onFinishHandler}
          disabled={loading}
        >
          <Form.Item
            label="Current password"
            name={"currentPassword"}
            rules={[
              {
                required: true,
                message: "Current password is required",
              },
            ]}
          >
            <Input type="password" />
          </Form.Item>
          <Form.Item
            label="New password"
            name={"newPassword"}
            rules={[
              {
                required: true,
                message: "Current password is required",
              },

              {
                min: 5,
                message: "Password greater than 5 characters is required",
              },
            ]}
          >
            <Input type="password" />
          </Form.Item>
          <Form.Item
            label="Confirm new password"
            name={"confirmPassword"}
            dependencies={["newPassword"]}
            rules={[
              {
                required: true,
                message: "Please confirm password",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    new Error("The new password that you entered do not match!")
                  );
                },
              }),
            ]}
          >
            <Input type="password" />
          </Form.Item>
          <div className="flex justify-end">
            <Button text="Change password" type="primary" loading={loading} />
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CredentialsSection;
