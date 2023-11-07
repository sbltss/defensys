import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Drawer, Form, Input, Popconfirm } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import UseGeocoder from "../../../../../../Hooks/use-geocoder";
import Button from "../../../../../UI/Button/Button";

const ResolveTicketDrawer = ({
  open,
  setOpen,
  title,
  form,
  onFinish,
  loading,
}) => {
  const searchInput = useRef(null);
  const { currentUser } = useSelector((state) => state.auth);
  const { setLocation, locationName } = UseGeocoder();
  const [selectedCoor, setSelectedCoor] = useState(null);
  const [defaultProps] = useState({
    center: {
      lat: 12.433103851530154,
      lng: 122.11480841586567,
    },
    zoom: 10,
    mapId: "15f9baeb3890ce9f",
  });
  const [map, setMap] = useState(null);
  const { selectedAcceptedTicket } = useSelector((state) => state.tickets);
  useEffect(() => {
    if (selectedCoor?.lat && selectedCoor?.lng) {
      map.panTo({
        lat: +selectedCoor.lat,
        lng: +selectedCoor.lng,
      });
      setLocation({
        lat: +selectedCoor.lat,
        lng: +selectedCoor.lng,
      });
      form.setFieldsValue({
        lat: +selectedCoor.lat,
        lng: +selectedCoor.lng,
      });
    }
  }, [selectedCoor?.lat, selectedCoor?.lng, form, map, setLocation]);
  useEffect(() => {
    if (open && selectedAcceptedTicket && map) {
      form.setFieldsValue({
        personsInvolved: "",
        address: selectedAcceptedTicket?.address || "",
        remarks: "",
        lat: +selectedAcceptedTicket.latitude,
        lng: +selectedAcceptedTicket.longitude,
      });
      setSelectedCoor({
        lat: +selectedAcceptedTicket.latitude,
        lng: +selectedAcceptedTicket.longitude,
      });
      map.panTo({
        lat: +selectedAcceptedTicket.latitude,
        lng: +selectedAcceptedTicket.longitude,
      });
    }
  }, [open, map, form, selectedAcceptedTicket]);

  useEffect(() => {
    if (locationName) form.setFieldValue("address", locationName);
  }, [locationName, form]);

  useEffect(() => {
    if (searchInput.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        searchInput.current.input,
        {
          componentRestrictions: { country: ["ph"] },
          fields: ["formatted_address", "geometry"],
          types: ["establishment", "geocode"],
        }
      );
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        const address = place.formatted_address;
        const coordinates = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setSelectedCoor(coordinates);
        form.setFieldsValue({
          address,
          ...coordinates,
        });
      });
    }
  }, [form, map]);
  return (
    <Drawer
      height={"60vh"}
      closable={false}
      onClose={() => {
        setOpen(false);
      }}
      open={open}
      placement="bottom"
      title={title}
      footer={
        <div className="w-full flex flex-row justify-end">
          <Popconfirm
            title="Change ticket status"
            description="Please double check map location if pinned correctly before submission"
            onConfirm={() => {
              form.submit();
            }}
            okText="Confirm"
            okButtonProps={{
              className:
                "border-primary-900 bg-primary-700 hover:bg-primary-800 text-gray-100",
            }}
            cancelText="Cancel"
            placement="topLeft"
          >
            <Button type="primary" text={"Submit"} loading={loading} />
          </Popconfirm>
        </div>
      }
    >
      <div className="w-full h-full flex flex-row gap-16">
        <div className="max-w-[900px] w-full">
          <Form
            disabled={loading}
            requiredMark="optional"
            className=""
            form={form}
            onFinish={onFinish}
            labelCol={{
              span: 5,
            }}
            wrapperCol={{
              span: 24,
            }}
            labelAlign="left"
          >
            {currentUser.accountType === "agent" && (
              <>
                <Form.Item
                  label="Remarks"
                  name={"remarks"}
                  rules={[
                    {
                      required: true,
                      message:
                        "Please provide a detailed report for this emergency",
                    },
                  ]}
                >
                  <Input.TextArea rows={4} />
                </Form.Item>
              </>
            )}
            {currentUser.accountType === "department" && (
              <>
                <Form.Item
                  label="Address"
                  name={"address"}
                  rules={[
                    {
                      required: true,
                      message:
                        "Please provide an updated address for the emergency ",
                    },
                  ]}
                >
                  <Input ref={searchInput} />
                </Form.Item>
                <Form.Item
                  label="Latitude"
                  name={"lat"}
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input readOnly />
                </Form.Item>
                <Form.Item
                  label="Longitude"
                  name={"lng"}
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input readOnly />
                </Form.Item>

                <Form.Item
                  label="Remarks"
                  name={"remarks"}
                  rules={[
                    {
                      required: true,
                      message:
                        "Please provide a detailed report for this emergency",
                    },
                  ]}
                >
                  <Input.TextArea rows={4} />
                </Form.Item>
                <Form.List name={"personsInvolved"}>
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <Form.Item
                          key={key}
                          label={key === 0 ? "Persons Involved" : " "}
                          {...restField}
                          name={[name]}
                          rules={[
                            {
                              required: true,
                              message:
                                "Please input name of a person involved or remove the field",
                            },
                          ]}
                        >
                          <Input
                            placeholder="Person involved"
                            suffix={
                              <MinusCircleOutlined
                                onClick={() => remove(name)}
                              />
                            }
                          />
                        </Form.Item>
                      ))}
                      <Form.Item>
                        <Button
                          text="Add Person Involved"
                          type="muted"
                          onClick={(e) => {
                            e.preventDefault();
                            add();
                          }}
                          block
                          icon={<PlusOutlined />}
                        />
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </>
            )}
          </Form>
        </div>
        {currentUser.accountType === "department" && (
          <div className="bg-red-300 w-full h-full">
            <GoogleMap
              mapContainerStyle={{ height: "100%", width: "100%" }}
              options={defaultProps}
              onClick={(e) => {
                setSelectedCoor({ lat: e.latLng.lat(), lng: e.latLng.lng() });
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
        )}
      </div>
    </Drawer>
  );
};

export default ResolveTicketDrawer;
