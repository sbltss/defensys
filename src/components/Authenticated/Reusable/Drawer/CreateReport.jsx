import React, { useEffect, useState } from "react";
import { Drawer, Form } from "antd";
import { LocationIcon } from "../../../../assets/icons/Icons";
import CreateReportForm from "../Form/CreateReportForm";
import { useSelector } from "react-redux";
import Button from "../../../UI/Button/Button";
import MapDrawer from "./MapDrawer";

const CreateReport = ({
  setMode,
  visible,
  locationName,
  setLocationName,
  location,
  setLocation,
  citizenInfo,
  fetchCitizenInfoLoading,
  rtCallerInfo,
}) => {
  const [form] = Form.useForm();
  const { createTicketFromCallLoading } = useSelector((state) => state.call);
  const [isMapOpen, setIsMapOpen] = useState(null);
  const [geocoder, setGeocoder] = useState(null);
  const [callerInfo, setCallerInfo] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  useEffect(() => {
    if (citizenInfo) setCallerInfo(citizenInfo);
  }, [citizenInfo]);
  useEffect(() => {
    if (visible) {
      setGeocoder(new window.google.maps.Geocoder());
    }
  }, [visible]);
  useEffect(() => {
    if (geocoder && location?.lat && location?.lng) {
      setCoordinates({ ...location });
      geocoder
        .geocode({
          location: {
            lat: location.lat,
            lng: location.lng,
          },
        })
        .then((response) => {
          if (response.results[0])
            setLocationName(response.results[0].formatted_address);
        });
    }
  }, [geocoder, location, setLocationName]);

  useEffect(() => {
    if (!createTicketFromCallLoading) {
      setCallerInfo(null);
      setMode(null);
      form.resetFields();
    }
  }, [createTicketFromCallLoading, setMode, form]);

  return (
    <>
      <Drawer
        maskClosable={false}
        title={
          <>
            {fetchCitizenInfoLoading && <span>Loading caller details...</span>}
            {!fetchCitizenInfoLoading && callerInfo && (
              <CitizenInfo
                citizenInfo={callerInfo}
                rtCallerInfo={rtCallerInfo}
              />
            )}
          </>
        }
        placement="right"
        onClose={() => setMode(null)}
        open={visible}
        width={"800px"}
        className={"p-0"}
        footer={
          <div className="flex flex-row justify-end">
            <Button
              disabled={createTicketFromCallLoading}
              loading={createTicketFromCallLoading}
              type="primary"
              text="Submit"
              onClick={() => {
                form.submit();
              }}
            />
          </div>
        }
      >
        <MapDrawer
          locatioName={locationName}
          isMapOpen={isMapOpen}
          setIsMapOpen={setIsMapOpen}
          location={location}
          setLocation={setLocation}
        />
        <div className="flex flex-col gap-1 py-1 px-2">
          <div className="flex flex-row justify-between">
            {!locationName && <span>Fetching Location...</span>}
            {!locationName && (
              <span className="italic text-xs text-red-700">
                {
                  "Unable to fetch location, refresh page upon enabling location permission"
                }
              </span>
            )}
            {locationName && (
              <span className="flex flex-row items-center text-primary gap-1">
                <LocationIcon />
                <span className="text-xs font-semibold">{`${locationName} (${location?.lat.toFixed(
                  4
                )}, ${location?.lng.toFixed(4)}})`}</span>
              </span>
            )}
            <Button
              text="View Location"
              type="primary"
              onClick={() => setIsMapOpen(true)}
            />
          </div>

          <CreateReportForm
            form={form}
            coords={location}
            locationName={locationName}
            callerId={callerInfo?.accountId}
            rtCallerId={rtCallerInfo?.accountId}
            coordinates={coordinates}
          />
        </div>
      </Drawer>
    </>
  );
};
const CitizenInfo = ({ citizenInfo, rtCallerInfo }) => {
  const { firstName, lastName, mobileNumber } = citizenInfo || {};
  const {
    firstName: rtFname,
    lastName: rtLname,
    contactNumber,
  } = rtCallerInfo || {};
  return (
    <div className="flex flex-row gap-1 items-center text-gray-700">
      {firstName && (
        <>
          <span className="text-base font-medium">Caller: </span>
          <span className="text-base font-semibold">{`${firstName} ${lastName}`}</span>
          {mobileNumber && (
            <span className="text-base font-medium"> - {mobileNumber}</span>
          )}
        </>
      )}
      {rtFname && (
        <>
          <span className="text-base font-medium">Caller: </span>
          <span className="text-base font-semibold">{`${rtFname} ${rtLname}`}</span>
          {contactNumber && (
            <span className="text-base font-medium"> - {contactNumber}</span>
          )}
        </>
      )}
      {!firstName && !rtFname && (
        <span className="text-base font-semibold">Unknown Caller</span>
      )}
    </div>
  );
};

export default CreateReport;
