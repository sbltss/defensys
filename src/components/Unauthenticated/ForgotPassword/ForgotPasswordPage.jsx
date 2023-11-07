import React from "react";
import EnterOtpForm from "./EnterOtpForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { useSelector } from "react-redux";
import ChangePasswordForm from "./ChangePasswordForm";

const ForgotPasswordPage = () => {
  const { otpToken, validOTP } = useSelector((state) => state.auth);
  return (
    <div className="w-screen h-screen bg-primary-800 flex justify-center items-center">
      <div className="min-w-[400px] bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
        <span className="text-xl gray-600 font-semibold mb-0">
          Forgot Password
        </span>
        {!otpToken && (
          <>
            <span className="text-md gray-600 font-regular mb-4">
              Enter your email address
            </span>
            <ForgotPasswordForm />
          </>
        )}
        {otpToken && !validOTP && (
          <>
            <span className="text-md gray-600 font-regular mb-4">
              Enter one time password
            </span>
            <EnterOtpForm />
          </>
        )}
        {otpToken && validOTP && (
          <>
            <span className="text-md gray-600 font-regular mb-4">
              Enter a new password
            </span>
            <ChangePasswordForm />
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
