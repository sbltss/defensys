import React, { useEffect, useState } from "react";
import Button from "../../../../UI/Button/Button";
import Call from "../../Call";
import CreateReport from "./Drawer/CreateReport";
import Fab from "./Fab/Fab";
import Reports from "./Reports/Reports";
import ReactDOM from "react-dom";
import { resourcesActions, emergencyActions } from "../../../../../store/store";
import { useDispatch, useSelector } from "react-redux";
const { fetchResources } = resourcesActions;
const { fetchTickets } = emergencyActions;

const Sumbungan = () => {
  const [peerError, setPeerError] = useState(null);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const resources = useSelector((state) => state.resources);
  const { tickets } = useSelector((state) => state.emergency);
  const dispatch = useDispatch();
  const [mode, setMode] = useState(null);
  const [triggerCall, setTriggerCall] = useState(null);
  const [status, setStatus] = useState(null);
  const callHandler = () => {
    setTriggerCall(true);
  };
  useEffect(() => {
    dispatch(fetchResources({ existing: resources, toFetch: ["caseTypes"] }));
    dispatch(fetchTickets());
  }, []);
  const [geocoder, setGeocoder] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState(null);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
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
  }, []);
  useEffect(() => {
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
  }, [geocoder, location?.coords.latitude, location?.coords.longitude]);
  return (
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
      {!status && (
        <>
          <Fab onClick={callHandler} disabled={!!peerError} />
          <CreateReport
            visible={mode === "create"}
            setMode={setMode}
            locationName={locationName}
            locationError={locationError}
            location={location}
            setLocation={setLocation}
          />
          <div className="px-2 rounded py-4">
            {peerError && (
              <div className="flex flex-row justify-between items-center pb-1 border-b-2">
                <span className="text-sm text-red-700">
                  Unable to establish a connection with the call center.
                </span>
                <Button
                  loading={isReconnecting}
                  text="Retry"
                  type="muted"
                  onClick={() => setIsReconnecting(true)}
                />
              </div>
            )}
            <div className="flex flex-row justify-between items-center pt-1">
              <span className="font-semibold text-gray-700">
                Reported Incidents
              </span>
              <Button
                text="Create Ticket"
                type="primary"
                onClick={() => setMode("create")}
              />
            </div>
            <Reports tickets={tickets} />
          </div>
        </>
      )}
    </>
  );
};

export default Sumbungan;
