import { GoogleMap, Marker } from "@react-google-maps/api";
import { Drawer, Form, message } from "antd";
import { getDatabase, ref, update } from "firebase/database";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UseGeocoder from "../../../../../Hooks/use-geocoder";
import firebaseApp from "../../../../../config/firebase";
import { addReportOfTheDay } from "../../../../../store/api/ticket-api";
import { callActions, ticketsActions } from "../../../../../store/store";
import Button from "../../../../UI/Button/Button";
import NewReportofTheDayForm from "./NewReportofTheDayForm";
const { setStatus } = callActions;

const { updateReportsOfTheDay } = ticketsActions;

const NewReportofTheDayDrawer = ({ open, setOpen }) => {
  const fbdb = getDatabase(firebaseApp);
  const { currentUser } = useSelector((state) => state.auth);
  const { status } = useSelector((state) => state.call);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { setLocation, locationName } = UseGeocoder();
  const [selectedCoor, setSelectedCoor] = useState(null);
  const [map, setMap] = useState(null);
  const [defaultProps] = useState({
    center: {
      lat: 14.533103851530154,
      lng: 121,
    },
    zoom: 11,
    mapId: "15f9baeb3890ce9f",
  });

  const agentPeerRef = useRef();

  useEffect(() => {
    if (selectedCoor?.lat && selectedCoor?.lng) {
      map.panTo({
        lat: +selectedCoor.lat,
        lng: +selectedCoor.lng,
      });
      form.setFieldsValue({
        lat: +selectedCoor.lat,
        lng: +selectedCoor.lng,
      });
    }
  }, [selectedCoor?.lat, selectedCoor?.lng, form, map]);

  useEffect(() => {
    if (locationName)
      form.setFieldsValue({
        address: locationName,
      });
  }, [locationName, form]);

  useEffect(() => {
    if (!open) {
      form.resetFields();
      setSelectedCoor(null);
    }
  }, [open]);

  const onFinishHandler = async (e) => {
    const body = { ...e };
    body.latitude = e.lat;
    body.longitude = e.lng;
    delete body.lat;
    delete body.lng;
    setLoading(true);
    const result = await addReportOfTheDay({
      body,
    });
    if (result.name === "AxiosError") {
      message.error(result.response.data.message);
    } else {
      message.success(result.data.message);
      form.resetFields();
      setLocation(null);
      setSelectedCoor(null);
      setOpen(false);
      dispatch(updateReportsOfTheDay(result.data.data));
    }

    setLoading(false);
  };

  useEffect(() => {
    if (currentUser.commandCenterId) {
      agentPeerRef.current = ref(
        fbdb,
        `${currentUser.commandCenterId}/peers/` + currentUser.accountId
      );

      if (open) {
        if (status !== "OFFLINE") {
          dispatch(setStatus("LOADING"));
          let newStatus = status === "ONLINE" ? "PROCESSING" : "OFFLINE";
          update(agentPeerRef.current, {
            status: newStatus,
            type: "AGENT",
          });
        }
      }
    }
  }, [open, currentUser]);

  return (
    <Drawer
      maskClosable={!loading}
      closable={!loading}
      title={"Add New Ticket"}
      height={"80vh"}
      placement="bottom"
      onClose={() => setOpen(false)}
      open={open}
      footer={
        <div className="flex flex-row justify-end">
          <Button
            text="Submit report"
            type="primary"
            onClick={form.submit}
            loading={loading}
          />
        </div>
      }
    >
      <div className="w-full h-full flex flex-row gap-16">
        <div className="max-w-[900px] w-full">
          <NewReportofTheDayForm
            setSelectedCoor={setSelectedCoor}
            loading={loading}
            onFinishHandler={onFinishHandler}
            form={form}
          />
        </div>
        <div className="w-full h-full">
          <GoogleMap
            mapContainerStyle={{ height: "100%", width: "100%" }}
            options={defaultProps}
            onClick={(e) => {
              setSelectedCoor({ lat: e.latLng.lat(), lng: e.latLng.lng() });
              setLocation({
                lat: +e.latLng.lat(),
                lng: +e.latLng.lng(),
              });
            }}
            onLoad={(map) => setMap(map)}
          >
            {selectedCoor && (
              <Marker
                position={{ lat: +selectedCoor.lat, lng: +selectedCoor.lng }}
              />
            )}
          </GoogleMap>
        </div>
      </div>
    </Drawer>
  );
};

export default NewReportofTheDayDrawer;
