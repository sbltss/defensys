import { GoogleMap, Marker } from "@react-google-maps/api";
import {
  Checkbox,
  Col,
  Drawer,
  Form,
  Input,
  Modal,
  Row,
  Select,
  message,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import UseGeocoder from "../../Hooks/use-geocoder";
import UploadPhoto from "./UploadPhoto";
import Button from "../UI/Button/Button";
import { contentWriterRegistration } from "../../store/api/auth-api";

function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

const Registration = ({ email, setMode, setEmail, setToken }) => {
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
  const { setLocation, locationName, locationError } = UseGeocoder();
  const latitude = Form.useWatch("latitude", form);
  const longitude = Form.useWatch("longitude", form);
  const [address, setAddress] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [isConsent, setIsConsent] = useState(false);

  const onConsentChecked = () => {
    if (!isConsent)
      Modal.confirm({
        title: "Terms and Conditions and the Privacy Policy",
        // icon: <ExclamationCircleOutlined />,
        content: (
          <div>
            <p>Terms and Conditions</p>
            <br />
            <p>Privacy Policy</p>
          </div>
        ),
        okText: "Agree",
        cancelText: "Cancel",
        okButtonProps: {
          className:
            "border-primary-800 bg-primary-700 hover:bg-primary-800 text-gray-100 shadow-sm justify-center  items-center rounded-md text-sm font-medium duration-300",
        },
        onOk: () => setIsConsent(!isConsent),
      });
    else setIsConsent(!isConsent);
  };

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
    import("../../assets/json/refbrgy.json").then((data) =>
      setBrgyJson(data.default)
    );
    import("../../assets/json/refcitymun.json").then((data) =>
      setCityJson(data.default)
    );
    import("../../assets/json/refprovince.json").then((data) =>
      setProvinceJson(data.default)
    );
    import("../../assets/json/refregion.json").then((data) =>
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
        setAddress(place.formatted_address);
      });
    }
  }, [form, map]);

  useEffect(() => {
    if (locationName) setAddress(locationName);
  }, [locationName]);

  useEffect(() => {
    if (email) form.setFieldsValue({ email });
  }, [email]);

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
  const onFinishHandler = async (e) => {
    if (!imagePreview)
      return message.warning("Representative's photo is required");

    setLoading(true);

    const formData = new FormData();
    const copy = { ...e };
    delete copy.address;
    if (!e.website) delete copy.website;
    Object.keys(copy).forEach((key) => formData.append(key, e[key]));

    formData.append(
      "address",
      getAddressName(e.regionId, e.provinceId, e.cityId, e.brgyId)
    );

    if (file) formData.append("image", file);
    else formData.append("image", dataURLtoFile(imagePreview, "image.jpeg"));
    let request = await contentWriterRegistration({
      body: formData,
    });

    if (request.name === "AxiosError") {
      message.error(request.response.data.message);
    } else {
      setImagePreview(null);
      setFile(null);
      setIsConsent(false);
      setAddress("");
      setMode("emailInput");
      setEmail(null);
      setToken(null);
      message.success(request.data.message);
    }

    setLoading(false);
  };
  const defaultProps = {
    center: {
      lat: 14.570805121379165,
      lng: 121.03702154291699,
    },
    zoom: 11,
    mapId: "15f9baeb3890ce9f",
  };
  return (
    <div>
      <Form
        layout="vertical"
        requiredMark={"optional"}
        form={form}
        disabled={loading}
        onFinish={onFinishHandler}
      >
        <Row gutter={16}>
          <Col span={24}>
            <span className="font-semibold text-lg">Organization</span>
          </Col>
          <Col span={12}>
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
            <Form.Item name="website" label="Official website">
              <Input placeholder="Please organization's website" />
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
          <div className="w-full h-60 max-h-96 mb-4">
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
          <Col span={24}>
            <span className="font-semibold text-lg">
              Official Representative
            </span>
          </Col>

          <Col span={12}>
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[
                {
                  required: true,
                  message: "Please enter first name",
                },
              ]}
            >
              <Input placeholder="Please enter first name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[
                {
                  required: true,
                  message: "Please enter last name",
                },
              ]}
            >
              <Input placeholder="Please enter last name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  message: "Please enter email address",
                },
                {
                  type: "email",
                  message: "Please enter a valid email address",
                },
              ]}
            >
              <Input
                readOnly={true}
                style={{
                  width: "100%",
                }}
                placeholder="Please enter email address"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="contactNumber"
              label="Contact Number"
              rules={[
                {
                  required: true,
                  message: "Please enter contact number",
                },
                {
                  pattern: /^9[0-9]{9}$/,
                  message: "Please enter a valid contact number",
                },
              ]}
            >
              <Input
                type="number"
                style={{
                  width: "100%",
                }}
                addonBefore="+63"
                placeholder="9XXXXXXXXX"
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <span className="font-semibold text-lg">Representative Image</span>
          </Col>
          <Col span={24}>
            <UploadPhoto
              setFile={setFile}
              imagePreview={imagePreview}
              setImagePreview={setImagePreview}
              onLoading={loading}
            />
          </Col>
        </Row>
      </Form>
      <div className="flex flex-col justify-center items-center gap-2 mt-8">
        <Checkbox checked={isConsent} onChange={onConsentChecked}>
          I agree to the Terms and Conditions and the Privacy Policy stated
          herein.
        </Checkbox>
        <Button
          text="Submit"
          type="primary"
          onClick={form.submit}
          disabled={!isConsent}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Registration;
