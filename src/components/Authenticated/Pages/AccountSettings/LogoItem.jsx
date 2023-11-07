import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Image, message, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Button from "../../../../components/UI/Button/Button";
import { authActions } from "../../../../store/store";
import { updateCCLogo } from "../../../../store/api/resources-api";

const { updateCurrentUser } = authActions;

const LogoItem = ({ field, value = undefined, editable = true }) => {
  const dispatch = useDispatch();
  const [imageUrl, setImageUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const getBase64 = (data) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => setImageUrl(reader.result));

    reader.readAsDataURL(data.file);
    setFile(data.file);
  };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  const beforeUpload = (f) => {
    const isJpgOrPng = f.type.includes("image/");

    if (!isJpgOrPng) {
      message.error("You can only upload image file!");
    }

    const isLt2M = f.size / 1024 / 1024 < 2;

    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }

    return isJpgOrPng && isLt2M;
  };

  const onFinishHandler = async () => {
    const formData = new FormData();
    formData.append("logo", file);

    setLoading(true);
    const request = await updateCCLogo({ body: formData });
    setLoading(false);
    if (request.name === "AxiosError") {
      message.error(request.response.data.message);
    } else {
      message.success(request.data.message);
      dispatch(updateCurrentUser());

      setIsEditing(false);
      setImageUrl(null);
      setLoading(null);
      setFile(null);
    }
  };
  return (
    <div className="flex flex-row justify-between px-2">
      <div className={isEditing ? "flex flex-row" : "flex flex-row flex-wrap"}>
        <span className="w-[280px] text-gray-700">{field}</span>
        {!!value && !isEditing && (
          <Image
            width={100}
            src={[import.meta.env.VITE_BASE_URL, "/", value].join("")}
          />
        )}
        {!value && !isEditing && (
          <span className="text-gray-400">{"Not Set"}</span>
        )}
        {isEditing && (
          <div>
            <ImgCrop
              fillColor="transparent"
              rotationSlider
              modalOk={<span className="text-gray-800">Ok</span>}
            >
              <Upload
                accept="image/*"
                customRequest={getBase64}
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={beforeUpload}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="avatar"
                    style={{
                      width: "50%",
                    }}
                  />
                ) : (
                  uploadButton
                )}
              </Upload>
            </ImgCrop>
            <div>
              <Button
                text="Cancel"
                type="muted"
                disabled={loading}
                onClick={() => {
                  setIsEditing(false);
                  setImageUrl(null);
                  setLoading(null);
                  setFile(null);
                }}
              />
              <Button
                text="Upload"
                type="primary"
                loading={loading}
                onClick={onFinishHandler}
              />
            </div>
          </div>
        )}

        {/* {!!value && isEditing && (
          <EditItem field={field} setIsEditing={setIsEditing} />
        )} */}
      </div>

      {!isEditing && (
        <div>
          <div
            className="rounded-lg hover:bg-blue-50 py-1 px-4 duration-300 cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            <span className="text-primary font-medium">
              {!value ? "Add" : "Edit"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogoItem;
