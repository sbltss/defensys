import React from "react";
import LoginPage from "./Login/LoginPage";
import { useSelector } from "react-redux";
import ForgotPasswordPage from "./ForgotPassword/ForgotPasswordPage";
import { Helmet } from "react-helmet";

const Unauthenticated = () => {
  const { mode } = useSelector((state) => state.auth);
  return (
    <>
      <Helmet>
        <title>Defensys - Login</title>
      </Helmet>
      {mode === "login" && <LoginPage />}
      {mode === "forgotPassword" && <ForgotPasswordPage />}
    </>
  );
};

export default Unauthenticated;
