import {
  Col,
  DatePicker,
  Form,
  Image,
  Input,
  Radio,
  Row,
  Select,
  Upload,
} from "antd";
import React from "react";
import Button from "../../../../UI/Button/Button";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useRef } from "react";
import { useEffect } from "react";
import { InboxOutlined } from "@ant-design/icons";
import SearchCitizenDrawer from "../../Emergency Tickets/NewTicketDrawer/SearchCitizenDrawer/SearchCitizenDrawer";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { getBase64 } from "../../../../../helpers/base64";

const { Dragger } = Upload;

const TicketForm = ({ form, onFinish, loading }) => {
  const { currentUser } = useSelector((state) => state.auth);
  const [geocoder, setGeocoder] = useState(null);
  const defaultProps = {
    center: {
      lat: currentUser.latitude,
      lng: currentUser.longitude,
    },
    zoom: 10,
    mapId: "15f9baeb3890ce9f",
  };
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [coor, setCoor] = useState({
    lat: currentUser.latitude,
    lng: currentUser.longitude,
  });
  const [isSearching, setIsSearching] = useState(null);
  const [selectedCitizen, setSelectedCitizen] = useState(null);
  const searchInput = useRef(null);
  const { reportCategory, caseTypes, agentList } = useSelector(
    (state) => state.resources
  );
  const fields = Form.useWatch(null, form);
  useEffect(() => {
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
      setCoor(coordinates);
      form.setFieldsValue({
        address,
      });
    });
  }, [form, setCoor]);

  const props = {
    name: "document",
    accept: "image/png, image/jpeg",
    multiple: false,
    beforeUpload: async (file) => {
      const base64 = await getBase64(file);
      setImage(file);
      setImagePreview(base64);
      return false;
    },
    onChange(info) {},
    onDrop(e) {},
  };
  useEffect(() => {
    if (selectedCitizen?.firstName && selectedCitizen?.lastName)
      form.setFieldValue(
        "reportCategoryDesc",
        `${selectedCitizen.firstName} ${selectedCitizen.lastName}`
      );
    else form.setFieldValue("reportCategoryDesc", undefined);
  }, [selectedCitizen?.firstName, selectedCitizen?.lastName, form]);

  useEffect(() => {
    setGeocoder(new window.google.maps.Geocoder());
  }, []);
  useEffect(() => {
    if (geocoder && coor?.lat && coor?.lng) {
      geocoder
        .geocode({
          location: {
            lat: coor.lat,
            lng: coor.lng,
          },
        })
        .then((response) => {
          if (response.results[0])
            form.setFieldsValue({
              address: response.results[0].formatted_address,
            });
        });
    }
  }, [geocoder, coor]);

  return (
    <>
      <SearchCitizenDrawer
        open={isSearching}
        setOpen={setIsSearching}
        setReportingCitizen={setSelectedCitizen}
      />
      <Form
        form={form}
        disabled={loading}
        requiredMark="optional"
        layout="vertical"
        onFinish={(e) => {
          const selectedAgent = agentList.find(
            (ag) => ag.accountId == fields.reportCategoryDesc
          );
          onFinish({
            ...e,
            callerId:
              fields?.reportCategory === 3
                ? selectedAgent.accountId
                : selectedCitizen?.accountId,
            latitude: coor.lat,
            longitude: coor.lng,
            lastName:
              fields?.reportCategory === 3
                ? selectedAgent.lastName
                : selectedCitizen?.lastName,
            firstName:
              fields?.reportCategory === 3
                ? selectedAgent.firstName
                : selectedCitizen?.firstName,
            mobileNumber:
              fields?.reportCategory === 3
                ? selectedAgent.contactNumber
                : selectedCitizen?.primaryMobile,
            file: image,
            cb: () => {
              setImagePreview(null);
              setImage(null);
            },
          });
        }}
      >
        <Row gutter={16}>
          <Col xl={12} lg={12} md={12} sm={12} span={24}>
            <Form.Item
              name={"ticketDateTime"}
              label="Ticket date time"
              rules={[
                {
                  required: true,
                  message: "Please select Ticket date time",
                },
              ]}
            >
              <DatePicker
                className="w-full"
                format={"YYYY-MM-DD HH:mm:ss"}
                showTime
              />
            </Form.Item>
          </Col>
          <Col xl={12} lg={12} md={12} sm={12} span={24}>
            <Form.Item
              name={"reportCategory"}
              label="Report Category"
              rules={[
                {
                  required: true,
                  message: "Please select report category",
                },
              ]}
            >
              <Select placeholder="Select report category">
                {reportCategory
                  .filter(
                    (category) =>
                      (!category.categoryId || category.categoryId === 2) &&
                      ![13, 16, 18, 20].includes(category.subCategoryId)
                  )
                  .map((category) => (
                    <Select.Option
                      key={category.subCategoryId}
                      value={category.subCategoryId}
                    >
                      {category.title}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>

          {fields?.reportCategory &&
            [1, 2, 9, 10, 11, 21, 22].includes(fields?.reportCategory) && (
              <Col xl={12} lg={12} md={12} sm={12} span={24}>
                <Form.Item
                  name={"reportCategoryDesc"}
                  label={"Reporting citizen"}
                  rules={[
                    {
                      required: true,
                      message: "Please search reporting citizen",
                    },
                  ]}
                >
                  <Input
                    prefix={
                      <button
                        onClick={() => setIsSearching(true)}
                        type="button"
                        className="border-gray-400 bg-gray-300 hover:bg-gray-400 text-gray-800 px-2 rounded-md"
                      >
                        Search
                      </button>
                    }
                    placeholder={"Search reporting citizen"}
                    readOnly
                  />
                </Form.Item>
              </Col>
            )}
          {fields?.reportCategory && fields?.reportCategory === 3 && (
            <Col xl={12} lg={12} md={12} sm={12} span={24}>
              <Form.Item
                name={"reportCategoryDesc"}
                label={"Dispatcher on duty"}
                rules={[
                  {
                    required: true,
                    message: "Select dispatcher on duty",
                  },
                ]}
              >
                <Select placeholder={"Select dispatcher on duty"}>
                  {agentList
                    .filter((agent) => !agent.isDeleted)
                    .map((agent) => (
                      <Select.Option
                        key={agent.accountId}
                        value={agent.accountId}
                      >
                        {`${agent.firstName} ${agent.lastName}`}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
          )}

          <Col xl={12} lg={12} md={12} sm={12} span={24}>
            <Form.Item
              name={"caseType"}
              label="Emergency Type"
              rules={[
                {
                  required: true,
                  message: "Please select emergency type",
                },
              ]}
            >
              <Select placeholder="Select emergency type">
                {caseTypes
                  .filter((type) => !type.isDeleted)
                  .map((type) => (
                    <Select.Option key={type.id} value={type.id}>
                      {type.typeName}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xl={12} lg={12} md={12} sm={12} span={24}>
            <Form.Item
              name={"withInjury"}
              label="With Injury?"
              rules={[
                {
                  required: true,
                  message: "Please select emergency type",
                },
              ]}
            >
              <Radio.Group>
                <Radio value={0}>No</Radio>
                <Radio value={1}>Yes</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>

          <Col xl={24} lg={24} md={24} sm={24} span={24}>
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
            <div className="h-64">
              <GoogleMap
                mapContainerStyle={{ height: "100%", width: "100%" }}
                center={defaultProps.center}
                zoom={defaultProps.zoom}
                options={{ mapId: defaultProps.mapId, disableDefaultUI: true }}
                onClick={(e) => {
                  setCoor({
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng(),
                  });
                }}
              >
                <Marker position={coor} />
              </GoogleMap>
            </div>
          </Col>

          {/* <Col xl={12} lg={12} md={12} sm={12} span={24}>
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
          </Col>

          <Col xl={12} lg={12} md={12} sm={12} span={24}>
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
          </Col> */}

          <Col xl={12} lg={24} md={24} sm={24} span={24}>
            <Form.Item
              label="Content"
              name={"content"}
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
          </Col>

          <Col xl={12} lg={24} md={24} sm={24} span={24}>
            <Form.Item label="Image">
              {!image && (
                <Dragger
                  {...props}
                  style={{ width: "100%", maxHeight: "250px" }}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag image file to this area to upload
                  </p>
                  <p className="ant-upload-hint">
                    To upload your Profile Picture drag and drop your image file
                    in the drop zone
                  </p>
                </Dragger>
              )}

              {imagePreview && (
                <div className="flex flex-col gap-1 relative">
                  <div className="absolute right-0 top-0 z-10">
                    <Button
                      text="Remove"
                      // disabled={onLoading}
                      type="muted"
                      onClick={() => {
                        setImage(null);
                        setImagePreview(null);
                      }}
                    />
                  </div>
                  <Image
                    crossOrigin="same-site"
                    style={{ height: "15vw", objectFit: "contain" }}
                    src={imagePreview}
                  ></Image>
                </div>
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default TicketForm;
