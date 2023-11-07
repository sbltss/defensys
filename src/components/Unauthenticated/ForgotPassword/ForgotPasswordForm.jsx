import React from "react";
import { Form, Spin } from "antd";
import { useSelector } from "react-redux";
import { authActions } from "../../../store/store";
import { useDispatch } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";
import { UsersIcon } from "../../../assets/icons/Icons";

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
  const { isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { sendOtp, setMode } = authActions;
  const onFinish = (values) => {
    dispatch(sendOtp(values));
  };

  const changeModeHandler = () => {
    dispatch(setMode("login"));
  };

  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo);
  };
  return (
    <Form
      className="w-full"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      initialValues={{ email: "" }}
    >
      <div className="w-full mb-4 flex rounded-md bg-gray-100 items-center">
        <UsersIcon className="px-3 mt-1" />
        <Form.Item
          className="flex-1 mb-0"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email",
            },
          ]}
        >
          <input
            disabled={isLoading}
            placeholder="Email"
            type={"text"}
            className="w-full py-3 bg-transparent focus:outline-none focus:ring-0"
          />
        </Form.Item>
      </div>

      <button
        disabled={isLoading}
        type="submit"
        className={`mb-6 group relative flex w-full justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white  focus:outline-none focus:ring-2 ${
          isLoading ? "bg-gray-300 " : "bg-primary-800 hover:bg-primary-900 "
        }focus:ring-primary-500 focus:ring-offset-2`}
      >
        {isLoading && <Spin indicator={antIcon} />}
        {!isLoading && "Continue"}
      </button>
      <span className="text-md">
        Remember now?{" "}
        <span
          onClick={changeModeHandler}
          className="text-primary-800 font-medium cursor-pointer"
        >
          Sign In
        </span>
      </span>
    </Form>
  );
};

export default ForgotPasswordForm;
