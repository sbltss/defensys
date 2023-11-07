import React, { useState } from "react";
import { Form, Spin } from "antd";
import { useSelector } from "react-redux";
import { authActions } from "../../../store/store";
import { useDispatch } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";
import { LockIcon, CloseEyeIcon, EyeIcon } from "../../../assets/icons/Icons";

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
    }}
    spin
    className="text-gray-700"
  />
);

const ChangePasswordForm = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { changePasswordLoading, recoveryEmail } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const { changePassword } = authActions;
  const onFinish = (values) => {
    dispatch(changePassword({ ...values, email: recoveryEmail }));
  };

  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo);
  };

  const togglePasswordVisible = () => setPasswordVisible(!passwordVisible);
  return (
    <Form
      className="w-full"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      initialValues={{ password: "" }}
    >
      <div className="w-full mb-4 flex rounded-md bg-gray-100 items-center">
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
            disabled={changePasswordLoading}
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

      <button
        disabled={changePasswordLoading}
        type="submit"
        className={`group relative flex w-full justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white  focus:outline-none focus:ring-2 ${
          changePasswordLoading
            ? "bg-gray-300 "
            : "bg-primary-800 hover:bg-primary-900 "
        }focus:ring-primary-500 focus:ring-offset-2`}
      >
        {changePasswordLoading && <Spin indicator={antIcon} />}
        {!changePasswordLoading && "Change Password"}
      </button>
    </Form>
  );
};

export default ChangePasswordForm;
