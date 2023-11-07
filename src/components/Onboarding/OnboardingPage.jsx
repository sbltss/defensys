import React from "react";
import { Helmet } from "react-helmet";
import logo from "./../../../src/assets/img/logo/logo.png";
import { MailIcon, PlaneIcon } from "../../assets/icons/Icons";
import VerifyEmail from "./VerifyEmail";
import { useState } from "react";
import SubmitOtp from "./SubmitOtp";
import Registration from "./Registration";
import { Wrapper } from "@googlemaps/react-wrapper";

const OnboardingPage = () => {
  const [mode, setMode] = useState("emailInput");
  const [email, setEmail] = useState(null);
  const [token, setToken] = useState(null);
  return (
    <>
      <Helmet>
        <title>Defensys - Onboarding</title>
        <link rel="icon" href={logo} />
        <meta name="description" content="Defensys - Onboarding" />
      </Helmet>

      <div className="w-screen h-screen bg-primary-800 flex justify-center items-center">
        <div className="bg-white rounded-lg w-[900px] min-h-[600px] h-fit  max-h-[90vh] flex flex-col p-4">
          <div className="flex flex-row items-center gap-4 mb-8">
            <div className="h-auto w-72">
              <img alt={"Defensys Logo"} src={logo} />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-base">
                This is the onboarding page for LGUs and organizations who want
                to use the Defensys platform as means of reporting the latest
                news and emergency situations happening in their areas of
                responsibility.
              </span>
            </div>
          </div>
          <div className="h-full w-full flex flex-col items-center overflow-y-auto overflow-x-hidden">
            <span className="text-2xl font-medium">
              {mode === "emailInput"
                ? "Verify your email address"
                : mode === "otpInput"
                ? "Enter OTP sent to your email address"
                : null}
            </span>
            {mode === "emailInput" ? (
              <MailIcon height="200" width="200" className="bg-primary" />
            ) : mode === "otpInput" ? (
              <PlaneIcon height="200" width="200" className="bg-primary" />
            ) : null}
            {mode === "emailInput" ? (
              <VerifyEmail
                setMode={setMode}
                setEmail={setEmail}
                setToken={setToken}
              />
            ) : mode === "otpInput" ? (
              <SubmitOtp setMode={setMode} token={token} />
            ) : (
              <Wrapper
                libraries={["geometry", "places", "visualization"]}
                apiKey={import.meta.env.VITE_GOOGLE_API}
              >
                <Registration
                  email={email}
                  setMode={setMode}
                  setEmail={setEmail}
                  setToken={setToken}
                />
              </Wrapper>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OnboardingPage;
