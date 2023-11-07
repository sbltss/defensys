import React, { useEffect, useState } from "react";
import { Drawer, Form, message } from "antd";
import { LocationIcon } from "../../../../../../Assets/Resources/Icons/Icons";
import CreateReportForm from "../Form/CreateReportForm";
import { useSelector } from "react-redux";
import Button from "../../../../../UI/Button/Button";
import MapDrawer from "./MapDrawer";

const CreateReport = ({
  setMode,
  visible,
  locationError,
  locationName,
  location,
  setLocation,
}) => {
  const [form] = Form.useForm();
  const { createTicketLoading } = useSelector((state) => state.emergency);
  const [isMapOpen, setIsMapOpen] = useState(false);
  // const [geocoder, setGeocoder] = useState(null);
  // const [location, setLocation] = useState(null);
  // const [locationName, setLocationName] = useState(null);
  // const [locationError, setLocationError] = useState(null);
  // useEffect(() => {
  //   if (visible) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         setLocation(position);
  //         setGeocoder(new window.google.maps.Geocoder());
  //         setLocationError(null);
  //       },
  //       (err) => {
  //         setLocationError(err.message);

  //         setLocation(null);
  //         setLocationName(null);
  //         console.log(err);
  //       }
  //     );
  //   }
  // }, [visible]);
  // useEffect(() => {
  //   if (geocoder && location?.coords.latitude && location?.coords.longitude) {
  //     geocoder
  //       .geocode({
  //         location: {
  //           lat: location.coords.latitude,
  //           lng: location.coords.longitude,
  //         },
  //       })
  //       .then((response) => {
  //         if (response.results[0])
  //           setLocationName(response.results[0].formatted_address);
  //       });
  //   }
  // }, [geocoder, location?.coords.latitude, location?.coords.longitude]);

  useEffect(() => {
    if (!createTicketLoading) setMode(null);
  }, [createTicketLoading]);
  return (
    <>
      <Drawer
        title="New Emergency"
        placement="bottom"
        onClose={() => setMode(null)}
        open={visible}
        height={"90%"}
        className={"p-0"}
        footer={
          <div className="flex flex-row justify-end">
            <Button
              disabled={createTicketLoading}
              loading={createTicketLoading}
              type="primary"
              text="Submit"
              onClick={() => {
                if (locationError) return message.error(locationError);
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
            {!locationName && !locationError && (
              <span>Fetching Location...</span>
            )}
            {!locationName && locationError && (
              <span className="italic text-xs text-red-700">
                {
                  "Unable to fetch location, refresh page upon enabling location permission"
                }
              </span>
            )}
            {locationName && (
              <span className="flex flex-row items-center text-primary gap-1">
                <LocationIcon />
                <span className="text-xs font-semibold">{`${locationName} (${location?.coords?.latitude.toFixed(
                  4
                )}, ${location?.coords?.longitude.toFixed(4)}})`}</span>
              </span>
            )}
            <Button
              text="Tag Manually"
              type="primary"
              onClick={() => setIsMapOpen(true)}
            />
          </div>

          <CreateReportForm
            form={form}
            coords={location?.coords}
            locationName={locationName}
          />
        </div>
      </Drawer>
    </>
  );
};

export default CreateReport;
