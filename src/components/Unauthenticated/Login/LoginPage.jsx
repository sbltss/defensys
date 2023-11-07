import React, { useEffect, useState } from "react";
import logo from "../../../assets/img/logo/logo.png";
import LoginForm from "./LoginForm";
import { useLocation, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loginMode, setLoginMode] = useState("default");

  useEffect(() => {
    localStorage.removeItem("lastActvity");
  }, []);

  useEffect(() => {
    if (location.pathname === "/dgsi") {
      navigate("/");
      setLoginMode("dgsi");
    }
  }, [location.pathname]);

  return (
    <div className="w-screen h-screen bg-primary-800 flex justify-center items-center">
      <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
        <img className="max-w-xs" src={logo} alt="logo" />
        <span className="text-2xl gray-800 font-semibold mb-4">
          {loginMode === "default" ? "Command Center Login" : "DGSI Login"}
        </span>
        <LoginForm loginMode={loginMode} />
      </div>
    </div>
  );
};

export default LoginPage;
