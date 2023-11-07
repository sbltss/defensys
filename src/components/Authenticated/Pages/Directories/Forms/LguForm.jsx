import { GoogleMap, Marker } from "@react-google-maps/api";
import { Col, Form, Input, Row, Select, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import UseGeocoder from "../../../../../Hooks/use-geocoder";
import cityJson from "../../../../../assets/json/refcitymun.json";
import provinceJson from "../../../../../assets/json/refprovince.json";
import regionJson from "../../../../../assets/json/refregion.json";
import {
  addLguInfo,
  editLguInfo,
} from "../../../../../store/api/resources-api";

const Lguform = ({
  form,
  mode,
  setMode,
  reload,
  loading,
  setLoading,
  currentUser,
}) => {
  const { locationName, setLocation, locationError } = UseGeocoder();
  const [provinces, setProvinces] = useState([]);
  const [lguName, setLguName] = useState("");
  const [cities, setCities] = useState([]);
  const searchInput = useRef();
  const [defaultProps, setDefaultProps] = useState({
    center: {
      lat: 14.570805121379165,
      lng: 121.03702154291699,
    },
    zoom: 11,
    mapId: "15f9baeb3890ce9f",
  });
  const regions = regionJson;

  const latitude = Form.useWatch("latitude", form);
  const longitude = Form.useWatch("longitude", form);

  const addLguInfoHandler = async (e) => {
    setLoading(true);
    const request = await addLguInfo(e);
    if (request.name === "AxiosError")
      message.error(request.response.data.message);
    else {
      message.success(request.data.message);
      reload(request.data.data, "add");
      form.resetFields();
      setMode(request.data.data);
    }

    setLoading(false);
  };
  const editLguInfoHandler = async (e) => {
    setLoading(true);
    const request = await editLguInfo(e);
    if (request.name === "AxiosError")
      message.error(request.response.data.message);
    else {
      message.success(request.data.message);
      reload(request.data.data, "edit");
      setLoading(false);
      form.resetFields();
      setMode(null);
    }
  };
  const onFinishHandler = (e) => {
    if (mode === "add") {
      const body = e;
      addLguInfoHandler({ body: { ...body, name: lguName } });
    } else {
      const { cityId, ...body } = e;
      editLguInfoHandler({ body: { ...body, name: lguName }, param: cityId });
    }
  };

  useEffect(() => {
    if (mode && mode !== "add" && mode) {
      form.setFieldsValue({
        ...mode,
      });
      setProvinces(provinceJson.filter((p) => p.regCode === mode.regionId));
      setCities(cityJson.filter((c) => c.provCode === mode.provinceId));
      setLguName(
        `${
          provinceJson.filter((c) => c.provCode === mode.provinceId)[0].provDesc
        } - ${
          cityJson.filter((c) => c.citymunCode === mode.cityId)[0].citymunDesc
        }`
      );
    } else {
      form.resetFields();
      setProvinces([]);
      setCities([]);
    }
  }, [mode, form]);

  const updateDropdownlist = (type, id) => {
    if (type === "regionId") {
      setProvinces(provinceJson.filter((p) => p.regCode === id));
      setCities([]);

      form.setFieldsValue({
        provinceId: "",
        cityId: "",
      });
    } else if (type === "provinceId") {
      setCities(cityJson.filter((c) => c.provCode === id));

      form.setFieldsValue({
        cityId: "",
      });
    } else if (type === "cityId") {
      setLguName(cityJson.filter((c) => c.citymunCode === id)[0].citymunDesc);
    }
  };

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
        setDefaultProps((prevState) => ({
          ...prevState,
          center: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          },
        }));
      });
    }
  }, [form]);

  return (
    <>
      <Form
        disabled={currentUser.accountType !== "superadmin"}
        layout="vertical"
        requiredMark={"optional"}
        form={form}
        onFinish={onFinishHandler}
      >
        <Row gutter={16}>
          <Col span={24}>
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
          <Col span={24}>
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
          <Col span={24}>
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
          <Col span={24}>
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
              <Input placeholder="Please enter latitude" />
            </Form.Item>
          </Col>
          <Col span={24}>
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
              <Input placeholder="Please enter longitude" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div className="w-full h-full max-h-96 flex flex-col gap-1">
        {currentUser.accountType === "superadmin" && (
          <Input ref={searchInput} placeholder="Search an address" />
        )}
        <GoogleMap
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
            <Marker position={{ lat: +latitude, lng: +longitude }}></Marker>
          )}
        </GoogleMap>
      </div>
    </>
  );
};

export default Lguform;
