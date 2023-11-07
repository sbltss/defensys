import React from "react";
import { Form, Spin } from "antd";
import { useSelector } from "react-redux";
import { authActions } from "../../../store/store";
import { useDispatch } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
    }}
    spin
    className="text-gray-700"
  />
);

const ForgotPasswordForm = () => {
  const { isLoading, otpToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { submitOtp } = authActions;
  const onFinish = (values) => {
    dispatch(submitOtp({ ...values, token: otpToken }));
  };

  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo);
  };
  return (
    <Form
      className="w-full"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      initialValues={{ otp: "" }}
    >
      <div className="w-full mb-4 flex rounded-md bg-gray-100 items-center">
        <Form.Item
          className="flex-1 mb-0"
          name="otp"
          rules={[
            {
              required: true,
              message: "Please input your otp",
            },
          ]}
        >
          <input
            disabled={isLoading}
            placeholder="OTP"
            type={"text"}
            className="w-full p-3 bg-transparent focus:outline-none focus:ring-0"
          />
        </Form.Item>
      </div>

      <button
        disabled={isLoading}
        type="submit"
        className={`group relative flex w-full justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white  focus:outline-none focus:ring-2 ${
          isLoading ? "bg-gray-300 " : "bg-primary-800 hover:bg-primary-900 "
        }focus:ring-primary-500 focus:ring-offset-2`}
      >
        {isLoading && <Spin indicator={antIcon} />}
        {!isLoading && "Continue"}
      </button>
    </Form>
  );
};

export default ForgotPasswordForm;
