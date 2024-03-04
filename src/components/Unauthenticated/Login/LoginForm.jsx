import React, { useState } from "react";
import { Form, Spin, Typography } from "antd";
import { useSelector } from "react-redux";
import { authActions } from "../../../store/store";
import { useDispatch } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";
import {
  CloseEyeIcon,
  EyeIcon,
  LockIcon,
  UsersIcon,
} from "../../../assets/icons/Icons";

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
    }}
    spin
    className="text-gray-700"
  />
);

const LoginForm = ({ loginMode }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const isLoading = useSelector((state) => state.auth.isLoading);
  const dispatch = useDispatch();
  const { login, dgsiLogin, setMode } = authActions;
  const onFinish = (values) => {
    if (loginMode === "default") dispatch(login(values));
    else dispatch(dgsiLogin(values));
  };

  const changeModeHandler = () => {
    dispatch(setMode("forgotPassword"));
  };

  const onFinishFailed = (errorInfo) => {};
  const togglePasswordVisible = () => setPasswordVisible(!passwordVisible);
  return (
    <Form
      className="w-full"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      initialValues={{ email: "ccadmin@defensys.ph", password: "Defensys2023" }}
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
      <div className="w-full mb-1 flex rounded-md bg-gray-100 items-center">
        <LockIcon className="px-3 mt-1" />
        <Form.Item
          className="flex-1 mb-0"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password",
            },
          ]}
        >
          <input
            disabled={isLoading}
            placeholder="Password"
            type={passwordVisible ? "text" : "password"}
            className="w-full py-3 bg-transparent focus:outline-none focus:ring-0"
          />
        </Form.Item>

        {passwordVisible && (
          <CloseEyeIcon className="px-3 mt-1" onClick={togglePasswordVisible} />
        )}
        {!passwordVisible && (
          <EyeIcon className="px-3 mt-1" onClick={togglePasswordVisible} />
        )}
      </div>
      <Typography
        onClick={changeModeHandler}
        className="mb-4 text-gray-500 text-sm text-right cursor-pointer"
      >
        Forgot Password?
      </Typography>
      <button
        disabled={isLoading}
        type="submit"
        className={`group relative flex w-full justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white  focus:outline-none focus:ring-2 ${
          isLoading ? "bg-gray-300 " : "bg-primary-800 hover:bg-primary-900 "
        }focus:ring-primary-500 focus:ring-offset-2`}
      >
        {isLoading && <Spin indicator={antIcon} />}
        {!isLoading && "Sign In"}
      </button>
    </Form>
  );
};

export default LoginForm;
