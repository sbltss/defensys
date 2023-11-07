import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuid } from "uuid";
import logo from "../../assets/img/logo/logo.png";
import { quickReportActions, resourcesActions } from "../../store/store";
import Button from "../UI/Button/Button";
import Call from "./Call";
import ReactDOM from "react-dom";
import CreateReport from "./Drawer/CreateReport";
const { setId, fetchCaseTypes } = quickReportActions;

const QuickReport = () => {
  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state.quickReport);
  const continueAsGuestHandler = () => {
    dispatch(setId(uuid()));
  };
  const [mode, setMode] = useState(null);
  const [peerError, setPeerError] = useState(null);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [triggerCall, setTriggerCall] = useState(null);
  const [status, setStatus] = useState(null);
  const callHandler = () => {
    setTriggerCall(true);
  };
  const [geocoder, setGeocoder] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState(null);
  const [locationError, setLocationError] = useState(null);
  useEffect(() => {
    if (!!userId) {
      setGeocoder(new window.google.maps.Geocoder());

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(position);
          setLocationError(null);
        },
        (err) => {
          setLocationError(err.message);

          setLocation(null);
          setLocationName(null);
          console.log(err);
        }
      );
    }
  }, [userId]);
  useEffect(() => {
    if (!!userId) {
      if (geocoder && location?.coords.latitude && location?.coords.longitude) {
        geocoder
          .geocode({
            location: {
              lat: location.coords.latitude,
              lng: location.coords.longitude,
            },
          })
          .then((response) => {
            if (response.results[0])
              setLocationName(response.results[0].formatted_address);
          });
      }
    }
  }, [geocoder, location?.coords.latitude, location?.coords.longitude, userId]);
  useEffect(() => {
    dispatch(setId(null));

    dispatch(fetchCaseTypes());
  }, []);

  return (
    <div className="w-screen h-screen bg-gray-800 flex justify-center items-center">
      <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center gap-4">
        <div className="flex flex-col items-center">
          <img className="max-w-xs" src={logo} alt="logo" />

          <span className="text-2xl gray-800 font-semibold mb-4">
            Command Center
          </span>
        </div>
        {!userId && (
          <>
            <Button
              text="Continue As Guest"
              type="primary"
              onClick={continueAsGuestHandler}
            />
          </>
        )}
        {!!userId && (
          <>
            {ReactDOM.createPortal(
              <Call
                setPeerError={setPeerError}
                location={location}
                status={status}
                setStatus={setStatus}
                triggerCall={triggerCall}
                setTriggerCall={setTriggerCall}
                isReconnecting={isReconnecting}
                setIsReconnecting={setIsReconnecting}
              />,
              document.getElementById("call-overlay")
            )}
            <CreateReport
              visible={mode === "create"}
              setMode={setMode}
              locationName={locationName}
              locationError={locationError}
              location={location}
              setLocation={setLocation}
            />
            <div className="flex flex-row gap-1">
              <Button
                text="Create Report"
                type="primary"
                onClick={() => setMode("create")}
              />
              <Button
                text="Call Dispatcher"
                type="primary"
                onClick={callHandler}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuickReport;
