import { GoogleMap, Marker } from "@react-google-maps/api";
import { Drawer, Form, message } from "antd";
import { getDatabase, ref, update } from "firebase/database";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UseGeocoder from "../../../../../Hooks/use-geocoder";
import firebaseApp from "../../../../../config/firebase";
import { createEmergencyTicket } from "../../../../../store/api/ticket-api";
import { callActions, ticketsActions } from "../../../../../store/store";
import Button from "../../../../UI/Button/Button";
import NewTicketForm from "./NewTicketForm";
import SearchCitizenDrawer from "./SearchCitizenDrawer/SearchCitizenDrawer";
const { setStatus } = callActions;

const { selectPendingTicket } = ticketsActions;

const NewTicketDrawer = ({ open, setOpen }) => {
  const fbdb = getDatabase(firebaseApp);
  const { currentUser } = useSelector((state) => state.auth);
  const { status } = useSelector((state) => state.call);
  const { agentList } = useSelector((state) => state.resources);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { setLocation, locationName } = UseGeocoder();
  const [selectedCoor, setSelectedCoor] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [reportingCitizen, setReportingCitizen] = useState(null);
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
      setImage(null);
      setImagePreview(null);
      setSelectedCoor(null);
    }
  }, [open]);

  const onFinishHandler = async (e) => {
    setLoading(true);
    const formdata = new FormData();
    Object.keys(e).forEach((key) => {
      if (key === "lat") return formdata.append("latitude", e[key]);
      if (key === "lng") return formdata.append("longitude", e[key]);
      formdata.append(key, e[key]);
    });

    if (e.reportCategory === 3) {
      const { firstName, lastName, accountId, contactNumber } =
        agentList.filter(
          (agent) => agent.accountId === e.reportCategoryDesc
        )[0];
      formdata.append("firstName", firstName);
      formdata.append("lastName", lastName);
      formdata.append("mobileNumber", contactNumber);
      if (accountId) formdata.append("callerId", accountId);
    } else {
      const { firstName, lastName, primaryMobile, accountId } =
        reportingCitizen;
      formdata.append("firstName", firstName);
      formdata.append("lastName", lastName);
      formdata.append("mobileNumber", primaryMobile);
      if (accountId) formdata.append("callerId", accountId);
    }

    if (image) formdata.append("image", image);

    const result = await createEmergencyTicket({ body: formdata });
    if (result.name === "AxiosError") {
      message.error(result.response.data.message);
    } else {
      message.success(result.data.message);
      form.resetFields();
      setImage(null);
      setImagePreview(null);
      setLocation(null);
      setSelectedCoor(null);
      setOpen(false);
      dispatch(selectPendingTicket(result.data.data));
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
        if (!["OFFLINE", "ERROR"].includes(status)) {
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
      <SearchCitizenDrawer
        open={isSearching}
        setOpen={setIsSearching}
        setReportingCitizen={setReportingCitizen}
      />
      <div className="w-full h-full flex flex-row gap-16">
        <div className="max-w-[900px] w-full">
          <NewTicketForm
            setSelectedCoor={setSelectedCoor}
            loading={loading}
            onFinishHandler={onFinishHandler}
            form={form}
            isSearching={isSearching}
            setIsSearching={setIsSearching}
            reportingCitizen={reportingCitizen}
            image={image}
            setImage={setImage}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
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

export default NewTicketDrawer;
