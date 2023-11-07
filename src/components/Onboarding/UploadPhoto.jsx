import { InboxOutlined } from "@ant-design/icons";
import { Image, message, Radio, Select, Space, Typography, Upload } from "antd";
import React, { useState } from "react";
import { useEffect } from "react";
import Webcam from "react-webcam";
import Button from "../UI/Button/Button";
const { Dragger } = Upload;

const UploadPhoto = ({
  onLoading,

  setFile,
  imagePreview,
  setImagePreview,
}) => {
  const [cameraError, setCameraError] = useState(null);
  const [cameraList, setCameraList] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [mode, setMode] = useState("cam");

  const props = {
    name: "identification",
    accept: "image/png, image/jpeg",
    multiple: false,
    beforeUpload: async (file) => {
      setFile(file);
      setImagePreview(await getBase64(file));
      return false;
    },
    onChange(info) {
      const { status } = info.file;

      if (status !== "uploading") {
      }

      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },

    onDrop(e) {},
  };
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result);

      reader.onerror = (error) => reject(error);
    });
  const removeImg = () => {
    setImagePreview(null);
  };
  useEffect(() => {
    const setCameras = async () => {
      navigator.permissions
        .query({ name: "camera" })
        .then(async (permissionObj) => {
          if (permissionObj.state === "granted") {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const cameras = devices.filter((d) => d.kind === "videoinput");
            setCameraList(cameras);
          } else if (permissionObj.state === "prompt") {
            navigator.mediaDevices.getUserMedia({ audio: false, video: true });
          }
          permissionObj.onchange = () => {
            setCameras();
          };
        })
        .catch((error) => {});
    };
    setCameras();
  }, []);
  return (
    <>
      {!imagePreview && (
        <Space>
          <Radio.Group
            buttonStyle="solid"
            style={{ marginBottom: 10 }}
            value={mode}
          >
            <Radio.Button
              value="upload"
              onClick={() => {
                setImagePreview(null);
                setMode("upload");
                setFile(null);
              }}
            >
              Upload File
            </Radio.Button>
            <Radio.Button
              value="cam"
              onClick={() => {
                setMode("cam");
                setImagePreview(null);
                setFile(null);
              }}
            >
              Web Cam
            </Radio.Button>
          </Radio.Group>

          {mode === "cam" && (
            <Select
              placeholder="Select Camera"
              style={{ marginBottom: "10px", width: "250px" }}
              onChange={(e) => setSelectedCamera(e)}
            >
              <Select.Option value="">Select Camera</Select.Option>
              {cameraList.map((c) => (
                <Select.Option key={c.deviceId} value={c.deviceId}>
                  {c.label}
                </Select.Option>
              ))}
            </Select>
          )}
        </Space>
      )}
      {!imagePreview && mode === "upload" && (
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag image file to this area to upload
          </p>
          <p className="ant-upload-hint">
            To upload your Valid ID / Personal Document, drag and drop your
            image file in the drop zone
          </p>
        </Dragger>
      )}
      {!imagePreview && mode === "cam" && selectedCamera && (
        <Webcam
          onUserMediaError={(err) => {
            setCameraError(err.toString().split(": ")[1]);
          }}
          onUserMedia={() => {
            setCameraError(null);
          }}
          audio={false}
          screenshotFormat="image/jpeg"
          width={cameraError ? "0" : "50%"}
          height={"50%"}
          videoConstraints={{
            // height: 720,
            // width: 720,
            aspectRatio: 1,
            deviceId: selectedCamera,
          }}
          style={{ display: "block", margin: "auto" }}
        >
          {({ getScreenshot }) => (
            <>
              {!cameraError && (
                <Space
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    paddingTop: 20,
                  }}
                >
                  <Button
                    text="Capture photo"
                    type={"primary"}
                    onClick={() => {
                      const imageSrc = getScreenshot();
                      setImagePreview(imageSrc);
                    }}
                  />
                </Space>
              )}
              {cameraError && (
                <Typography.Title level={4}>{cameraError}</Typography.Title>
              )}
            </>
          )}
        </Webcam>
      )}
      {!selectedCamera && mode === "cam" && (
        <Typography.Title level={4}>No Camera Selected</Typography.Title>
      )}
      {imagePreview && (
        <Space direction="vertical">
          <Image style={{ height: "15vw" }} src={imagePreview}></Image>
          <Space>
            <Button
              text="Replace"
              disabled={onLoading}
              type="secondary"
              onClick={removeImg}
            />
            {/* <Button
              text="Upload"
              loading={onLoading}
              type="primary"
              onClick={() => {
                if (file) onUploadDocument(file);
                else {
                  let newFile = dataURLtoFile(imagePreview, "newId.jpeg");
                  onUploadDocument(newFile);
                }
              }}
            /> */}
          </Space>
        </Space>
      )}
    </>
  );
};
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

export default UploadPhoto;
