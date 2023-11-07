import { InboxOutlined } from "@ant-design/icons";
import { Button, Form, Input, Space, Upload } from "antd";
import React, { useState } from "react";

const AddVid = ({ setPreview, preview, setImagePreview2, imagePreview2, form2 }) => {
  const [videoPreview, setVideoPreview] = useState(null);
  const [file, setFile] = useState(null);
  const props = {
    name: "fileList",
    accept: "video/mp4, video/quicktime",
    // accept: 'image/png, image/jpeg',
    multiple: false,
    beforeUpload: async (file) => {
      setFile(file);
      setVideoPreview(await getBase64(file));
      return false;
    },
  };
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result);

      reader.onerror = (error) => reject(error);
    });
  const removeVid = () => {
    setVideoPreview(null);
  };

  const { Dragger } = Upload;

  // console.log(file);
  // console.log('image preview', imagePreview);
  const onFinish = (values) => {
    // setPreview(...preview, values);
    setPreview([...preview, { ...values, id: preview.length }]);
    setVideoPreview(null);
    // console.log(values);
    // console.log(preview);
  };

  return (
    <>
      <Form
        className=" max-w-[700px] mx-auto"
        onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        layout="vertical"
        // form={form}
      >
        <Form.Item name="id" hidden>
          <Input hidden />
        </Form.Item>
        <Form.Item name="type" hidden initialValue="video">
          <Input hidden />
        </Form.Item>
        <Form.Item
          label={<p className=" text-[20px] m-0 font-semibold">Upload video</p>}
          className="pt-2 text-[18px]"
          name="value"
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please input text!",
            },
          ]}
        >
          {!videoPreview && (
            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag video file to this area to upload</p>
              <p className="ant-upload-hint">
                To upload your Valid ID / Personal Document, drag and drop your image file in the drop zone
              </p>
            </Dragger>
          )}
        </Form.Item>

        {videoPreview && (
          <Space direction="vertical" className=" flex justify-center items-center">
            <video
              className=" w-full"
              // autoPlay={true}
              loop={true}
              // muted={true}
              controls={true}
              src={videoPreview}
            />

            <Space>
              <Button
                // text="Remove"
                // disabled={onLoading}
                type="default"
                onClick={removeVid}
              >
                Remove
              </Button>
              <Button
                // text="Upload"
                // loading={onLoading}
                htmlType="submit"
                type="default"
                // onClick={() => onUploadDocument(file)}
              >
                Add
              </Button>
            </Space>
          </Space>
        )}
      </Form>
    </>
  );
};

export default AddVid;
