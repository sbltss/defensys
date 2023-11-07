import { Form, Input, Select, Image, Radio, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import placeHolderImage from "../../../../../../Assets/img/placeholder-image.png";
import { blobToBase64 } from "../../../../../../Helpers/formData";
import Button from "../../../../../UI/Button/Button";
import { emergencyActions } from "../../../../../../store/store";
const { createTicket } = emergencyActions;

const CreateReportForm = ({ form, locationName, coords }) => {
  const dispatch = useDispatch();
  const { caseTypes } = useSelector((state) => state.resources);
  const fileInputRef = useRef(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  useEffect(() => {
    const convert = async () => {
      const result = await blobToBase64(uploadedFile);
      setUploadedImage(result);
    };

    if (uploadedFile) {
      convert();
    }
  }, [uploadedFile]);
  const onFileChangeHandler = (e) => {
    setUploadedFile(e.target.files[0]);
  };
  const onFinishHandler = (values) => {
    const { caseType, content, withInjury } = values;
    const formData = new FormData();
    if (!uploadedFile)
      return message.warning("Please upload an image of the emergency");
    formData.append("caseType", caseType);
    formData.append("address", locationName);
    formData.append("latitude", coords.latitude);
    formData.append("longitude", coords.longitude);
    formData.append("content", content);
    formData.append("withInjury", withInjury);
    formData.append("file", uploadedFile);

    dispatch(createTicket(formData));
  };
  return (
    <Form requiredMark="optional" form={form} onFinish={onFinishHandler}>
      <Form.Item
        label="Emergency Type"
        name="caseType"
        rules={[{ required: true, message: "Please Select Emergency Type" }]}
      >
        <Select placeholder="Select Emergency Type">
          {caseTypes
            .filter((type) => !type.isDeleted)
            .map((ct) => (
              <Select.Option key={ct.id} value={ct.id}>
                {ct.typeName}
              </Select.Option>
            ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="With Injury"
        name="withInjury"
        rules={[{ required: true, message: "Please Select One" }]}
      >
        <Radio.Group
          options={[
            { label: "Yes", value: 1 },
            { label: "No", value: 0 },
          ]}
        />
      </Form.Item>
      <Form.Item
        label="Brief Description"
        name="content"
        rules={[
          { required: true, message: "Please Input Emergency Description" },
        ]}
      >
        <Input.TextArea rows={5} />
      </Form.Item>
      <div className="flex flex-row justify-between items-center pb-1">
        <span>Upload Image</span>
        {uploadedImage && (
          <Button
            text="Remove"
            type="muted"
            onClick={() => {
              setUploadedFile(null);
              setUploadedImage(null);
            }}
          />
        )}
      </div>

      <div className="flex flex-col items-center justify-center">
        {!uploadedImage && (
          <img
            alt="placeholder"
            src={placeHolderImage}
            className="w-[50%]"
            onClick={() => fileInputRef.current.click()}
          />
        )}
        {uploadedImage && (
          <div className="w-[50%]">
            <Image
              crossOrigin="same-site"
              alt="uploaded"
              src={uploadedImage}
              className="w-full"
            />
          </div>
        )}
      </div>
      <input
        className="hidden"
        type="file"
        accept="image/png, image/gif, image/jpeg"
        ref={fileInputRef}
        onChange={onFileChangeHandler}
      />
    </Form>
  );
};

export default CreateReportForm;
