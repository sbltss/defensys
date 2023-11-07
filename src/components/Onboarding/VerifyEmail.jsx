import { Form, Input, message } from "antd";
import React, { useState } from "react";
import Button from "../UI/Button/Button";
import { sendWriterRegOtp } from "../../store/api/auth-api";

const VerifyEmail = ({ setMode, setEmail, setToken }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinishHandler = async (body) => {
    setLoading(true);
    const result = await sendWriterRegOtp({ body });
    if (result.name === "AxiosError") {
      message.error(result.response.data.message);
    } else {
      message.success(result.data.message);
      setMode("otpInput");
      setEmail(result.data.email);
      setToken(result.data.token);
    }
    setLoading(false);
  };
  return (
    <div className="flex flex-col justify-center gap-2 min-w-[400px]">
      <Form form={form} onFinish={onFinishHandler}>
        <Form.Item
          label=""
          name="email"
          rules={[
            {
              type: "email",
              message: "The input is not a valid email",
            },
            {
              required: true,
              message: "Please input your email address",
            },
          ]}
        >
          <Input placeholder="Input your email address" disabled={loading} />
        </Form.Item>
      </Form>
      <Button
        text="Verify Email"
        type="primary"
        onClick={form.submit}
        loading={loading}
      />
    </div>
  );
};

export default VerifyEmail;
