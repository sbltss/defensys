import { Form, Input, Select } from "antd";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const NewReportofTheDayForm = ({
  form,
  onFinishHandler,
  setSelectedCoor,
  loading,
}) => {
  const searchInput = useRef(null);
  const { caseTypes } = useSelector((state) => state.resources);

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
      setSelectedCoor(coordinates);
      form.setFieldsValue({
        address,
        ...coordinates,
      });
    });
  }, [form, setSelectedCoor]);
  return (
    <Form
      disabled={loading}
      form={form}
      requiredMark="optional"
      labelCol={{
        span: 5,
      }}
      wrapperCol={{
        span: 24,
      }}
      labelAlign="left"
      onFinish={onFinishHandler}
    >
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
      <Form.Item
        label="Address"
        name={"address"}
        rules={[
          {
            required: true,
            message: "Please provide an updated address for the emergency ",
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
        label="Hazard Note"
        name={"hazardNote"}
        rules={[
          {
            required: true,
            message: "Please provide hazardNote",
          },
        ]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>
    </Form>
  );
};
export default NewReportofTheDayForm;
