import { InboxOutlined } from "@ant-design/icons";
import { Form, Image, Input, Radio, Select } from "antd";
import Dragger from "antd/es/upload/Dragger";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Button from "../../../../UI/Button/Button";

const NewTicketForm = ({
  form,
  reportingCitizen,
  setIsSearching,
  image,
  setImage,
  imagePreview,
  setImagePreview,
  onFinishHandler,
  setSelectedCoor,
}) => {
  const searchInput = useRef(null);
  const { reportCategory, caseTypes, agentList } = useSelector(
    (state) => state.resources
  );
  useEffect(() => {
    if (reportingCitizen?.firstName && reportingCitizen?.lastName)
      form.setFieldValue(
        "reportCategoryDesc",
        `${reportingCitizen.firstName} ${reportingCitizen.lastName}`
      );
    else form.setFieldValue("reportCategoryDesc", undefined);
  }, [reportingCitizen?.firstName, reportingCitizen?.lastName, form]);
  const fields = Form.useWatch(null, form);

  const props = {
    name: "document",
    accept: "image/png, image/jpeg",
    multiple: false,
    beforeUpload: async (file) => {
      setImage(file);
      setImagePreview(await getBase64(file));
      return false;
    },
    onChange(info) {},
    onDrop(e) {},
  };
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
      {fields?.reportCategory &&
        [1, 2, 9, 10, 11, 21, 22].includes(fields?.reportCategory) && (
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
        )}
      {fields?.reportCategory && fields?.reportCategory === 3 && (
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
                <Select.Option key={agent.accountId} value={agent.accountId}>
                  {`${agent.firstName} ${agent.lastName}`}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
      )}
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
        name={"withInjury"}
        label=" "
        rules={[
          {
            required: true,
            message: "Please select emergency type",
          },
        ]}
      >
        <Radio.Group>
          <Radio value={0}>Without Injury</Radio>
          <Radio value={1}>With Injury</Radio>
        </Radio.Group>
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
        label="Content"
        name={"content"}
        rules={[
          {
            required: true,
            message: "Please provide a detailed report for this emergency",
          },
        ]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item label="Image">
        {!image && (
          <Dragger {...props} style={{ width: "100%", maxHeight: "250px" }}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag image file to this area to upload
            </p>
            <p className="ant-upload-hint">
              To upload your Profile Picture drag and drop your image file in
              the drop zone
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
    </Form>
  );
};
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);

    reader.onerror = (error) => reject(error);
  });
export default NewTicketForm;
