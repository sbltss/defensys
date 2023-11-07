import React from "react";
import logo from "../../assets/img/logo/logo.png";
import Button from "../UI/Button/Button";
import usePeer from "../../Hooks/use-Peer";
const Call = ({
  triggerCall,
  setTriggerCall,
  status,
  setStatus,
  location,
  setPeerError,
  isReconnecting,
  setIsReconnecting,
}) => {
  const { queueing, accountId, videoRef, dropCall } = usePeer({
    obj: {
      triggerCall,
      setTriggerCall,
      status,
      setStatus,
      location,
      setPeerError,
      isReconnecting,
      setIsReconnecting,
    },
  });

  return (
    <>
      {!!status && (
        <div className="py-6 bg-black w-screen h-screen flex flex-col items-center absolute z-50">
          <div className="flex-1 w-full flex flex-col items-center justify-center gap-2">
            {status !== "onCall" && (
              <div className="bg-white w-60 h-60 p-8 rounded-full animate-pulse">
                <img
                  alt="phone"
                  src={logo}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            {status === "calling" && (
              <span className="text-white font-semibold text-xl">
                Calling a Command Center Dispatcher...
              </span>
            )}
            {status === "queueing" && (
              <div className="flex flex-col gap-2 items-center">
                <span className="text-white font-semibold text-xl">
                  Command Center is at Capacity...
                </span>
                <span className="text-white font-bold text-6xl">
                  {queueing.indexOf(accountId) + 1}
                </span>
                <span className="text-white font-semibold text-xl">
                  Queue Position
                </span>
              </div>
            )}
            <video ref={videoRef} playsInline={true} />
          </div>
          <div className="w-full flex flex-row justify-center p-2 gap-4">
            {(status === "queueing" || status === "calling") && (
              <Button type="danger" text="Cancel Call" onClick={dropCall} />
            )}
            {status === "onCall" && (
              <>
                <Button type="danger" text="Drop Call" onClick={dropCall} />

                {/* <button className="text-white bg-gray-500 w-14 h-14 rounded-full hover:bg-gray-400 duration-300">
                  <DeviceIcon />
                </button>
                <button className="text-white bg-gray-500 w-14 h-14 rounded-full hover:bg-gray-400 duration-300">
                  <DeviceIcon />
                </button>
                <button
                  className="text-white bg-red-700 w-14 h-14 rounded-full hover:bg-red-600 duration-300"
                  onClick={dropCall}
                >
                  <DeviceIcon />
                </button> */}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Call;
