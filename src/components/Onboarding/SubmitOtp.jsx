import { Form, Input, message } from "antd";
import React, { useState } from "react";
import Button from "../UI/Button/Button";
import { submitWriterRegOtp } from "../../store/api/auth-api";

const SubmitOtp = ({ setMode, token }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinishHandler = async (body) => {
    setLoading(true);
    const result = await submitWriterRegOtp({ body: { ...body, token } });
    if (result.name === "AxiosError") {
      message.error(result.response.data.message);
    } else {
      message.success(result.data.message);
      setMode("registration");
    }
    setLoading(false);
  };
  return (
    <div className="flex flex-col justify-center gap-2 min-w-[400px]">
      <Form form={form} onFinish={onFinishHandler}>
        <Form.Item
          label=""
          name="otp"
          rules={[
            {
              required: true,
              message: "Please input your one time password",
            },
          ]}
        >
          <Input
            placeholder="Input your one time password"
            disabled={loading}
          />
        </Form.Item>
      </Form>
      <Button
        text="Submit OTP"
        type="primary"
        onClick={form.submit}
        loading={loading}
      />
    </div>
  );
};

export default SubmitOtp;
