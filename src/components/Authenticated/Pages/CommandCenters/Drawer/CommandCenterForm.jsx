import { GoogleMap, Marker } from "@react-google-maps/api";
import { Col, Drawer, Form, Input, Row, Select, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import useGeocoder from "../../../../../Hooks/use-geocoder";
import {
  createCommandCenterInstance,
  updateCommandCenter,
} from "../../../../../store/api/adminFn-api";
import Button from "../../../../UI/Button/Button";

const CommandCenterForm = ({ mode, onClose, reloadTable }) => {
  const searchInput = useRef(null);
  const [brgyJson, setBrgyJson] = useState([]);
  const [cityJson, setCityJson] = useState([]);
  const [provinceJson, setProvinceJson] = useState([]);
  const [regions, setRegions] = useState([]);
  const [map, setMap] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [brgys, setBrgys] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { setLocation, locationName, locationError } = useGeocoder();
  const latitude = Form.useWatch("latitude", form);
  const longitude = Form.useWatch("longitude", form);
  const [address, setAddress] = useState("");

  const getAddressName = (regionId, provinceId, cityId, brgyId) => {
    let places = [];
    places.push(regions.filter((r) => r.regCode === regionId)[0].regDesc);
    places.push(
      provinceJson.filter((r) => r.provCode === provinceId)[0].provDesc
    );
    places.push(
      cityJson.filter((r) => r.citymunCode === cityId)[0].citymunDesc
    );
    // places.push(brgyJson.filter((r) => r.brgyCode === brgyId)[0].brgyDesc);
    return places.join(`, `);
  };

  useEffect(() => {
    import("../../../../../assets/json/refbrgy.json").then((data) =>
      setBrgyJson(data.default)
    );
    import("../../../../../assets/json/refcitymun.json").then((data) =>
      setCityJson(data.default)
    );
    import("../../../../../assets/json/refprovince.json").then((data) =>
      setProvinceJson(data.default)
    );
    import("../../../../../assets/json/refregion.json").then((data) =>
      setRegions(data.default)
    );
  }, []);

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
        form.setFieldsValue({
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
        });
      });
    }
  }, [form, map]);

  useEffect(() => {
    if (locationName) setAddress(locationName);
  }, [locationName]);

  const defaultProps = {
    center: {
      lat: 14.570805121379165,
      lng: 121.03702154291699,
    },
    zoom: 11,
    mapId: "15f9baeb3890ce9f",
  };

  const onFinishHandler = async (e) => {
    setLoading(true);
    let request;
    if (mode === "adding")
      request = await createCommandCenterInstance({
        body: {
          ...e,
          address: getAddressName(e.regionId, e.provinceId, e.cityId, e.brgyId),
        },
      });
    else
      request = await updateCommandCenter({
        body: {
          ...e,
          address: getAddressName(e.regionId, e.provinceId, e.cityId, e.brgyId),
        },
        param: mode.commandCenterId,
      });

    if (request.name === "AxiosError") {
      message.error(request.response.data.message);
    } else {
      reloadTable();
      message.success(request.data.message);
      onClose();
    }

    setLoading(false);
  };

  useEffect(() => {
    if (mode && mode != "adding") {
      form.setFieldsValue(mode);
      setAddress(mode.address);
      setProvinces(provinceJson.filter((p) => p.regCode === mode.regionId));
      setCities(cityJson.filter((c) => c.provCode === mode.provinceId));
      setBrgys(brgyJson.filter((b) => b.citymunCode === mode.cityId));
    } else form.resetFields();
  }, [mode, provinceJson, cityJson, brgyJson]);

  const updateDropdownlist = (type, id) => {
    if (type === "regionId") {
      setProvinces(provinceJson.filter((p) => p.regCode === id));
      setCities([]);

      setBrgys([]);
      form.setFieldsValue({
        provinceId: "",
        cityId: "",
        brgyId: "",
      });
    } else if (type === "provinceId") {
      setCities(cityJson.filter((c) => c.provCode === id));

      setBrgys([]);
      form.setFieldsValue({
        cityId: "",
        brgyId: "",
      });
    } else if (type === "cityId") {
      setBrgys(brgyJson.filter((b) => b.citymunCode === id));
      form.setFieldsValue({
        brgyId: "",
      });
    }
  };
  return (
    <Drawer
      placement="right"
      title={
        mode !== "adding"
          ? "Edit Command Center Information"
          : "Create a Command Center Instance"
      }
      onClose={onClose}
      open={!!mode}
      width={"600px"}
      footer={
        <div className="w-full flex flex-row justify-end">
          <Button
            loading={loading}
            text={
              mode !== "adding"
                ? "Update Command Center Information"
                : "Create Command Center Instance"
            }
            type="primary"
            onClick={() => form.submit()}
          />
        </div>
      }
    >
      <Form
        layout="vertical"
        requiredMark={"optional"}
        form={form}
        disabled={loading}
        onFinish={onFinishHandler}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="name"
              label="Name"
              rules={[
                {
                  required: true,
                  message: "Please enter name",
                },
              ]}
            >
              <Input placeholder="Please enter name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="regionId"
              label="Region"
              rules={[
                {
                  required: true,
                  message: "Please select a region.",
                },
              ]}
            >
              <Select
                placeholder="Select Region"
                onChange={(e) => updateDropdownlist("regionId", e)}
              >
                {regions.map((r) => (
                  <Select.Option key={r.regCode} value={r.regCode}>
                    {r.regDesc}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="provinceId"
              label="Province"
              rules={[
                {
                  required: true,
                  message: "Please select a province.",
                },
              ]}
            >
              <Select
                placeholder="Select Province"
                onChange={(e) => updateDropdownlist("provinceId", e)}
              >
                {provinces.map((p) => (
                  <Select.Option key={p.provCode} value={p.provCode}>
                    {p.provDesc}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="cityId"
              label="City"
              rules={[
                {
                  required: true,
                  message: "Please select a city.",
                },
              ]}
            >
              <Select
                placeholder="Select City"
                onChange={(e) => updateDropdownlist("cityId", e)}
              >
                {cities.map((c) => (
                  <Select.Option key={c.citymunCode} value={c.citymunCode}>
                    {c.citymunDesc}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="brgyId"
              label="Barangay"
              rules={[
                {
                  required: true,
                  message: "Please select a barangay.",
                },
              ]}
            >
              <Select placeholder="Select Barangay">
                {brgys.map((b) => (
                  <Select.Option key={b.brgyCode} value={b.brgyCode}>
                    {b.brgyDesc}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              // name="address"
              required={true}
              label="Address"
            >
              <Input
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
                ref={searchInput}
                required={true}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="latitude"
              label="Latitude"
              rules={[
                {
                  required: true,
                  message: "Please enter latitude",
                },
              ]}
            >
              <Input readOnly={true} placeholder="Please enter latitude" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="longitude"
              label="Longitude"
              rules={[
                {
                  required: true,
                  message: "Please enter longitude",
                },
              ]}
            >
              <Input readOnly={true} placeholder="Please enter longitude" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div className="w-full h-full max-h-96">
        <GoogleMap
          onLoad={(map) => setMap(map)}
          onClick={(e) => {
            setLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
            form.setFieldsValue({
              latitude: e.latLng.lat(),
              longitude: e.latLng.lng(),
            });
          }}
          mapContainerStyle={{ height: "100%", width: "100%" }}
          center={defaultProps.center}
          zoom={defaultProps.zoom}
          options={{ mapId: defaultProps.mapId, disableDefaultUI: true }}
        >
          {latitude && longitude && (
            <Marker position={{ lat: latitude, lng: longitude }}></Marker>
          )}
        </GoogleMap>
      </div>
    </Drawer>
  );
};

export default CommandCenterForm;
