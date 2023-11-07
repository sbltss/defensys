import { InboxOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, Form, Image, Input, Select, Space, Spin, Upload } from "antd";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { addingContent, edittingContent } from "../../../../store/slices/news/newsSlice";
import { addingContent, edittingContent } from "../../../../../../store/slices/news-slice";
import { getBase64 } from "../../../../../../helpers/base64";

const EditAddForm = ({
  preview,
  setPreview,
  isOpenAdd,
  setIsOpenAddContent,
  contentLength,
  selectedType,
  imagePreview,
  videoPreview,
  setVideoPreview,
  setImagePreview,
  formEditAddImg,
  formEditAddText,
  formEditAddVid,
  newsId,
  isAdd,
  contId,
  setContentLength,
  imageUrl,
  videoUrl,
  setImageUrl,
  setVideoUrl,
}) => {
  const [file, setFile] = useState(null);
  const [fileVid, setFileVid] = useState(null);
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.news);

  const { TextArea } = Input;
  const textArea = useRef(null);

  const fieldRefs = {
    value: textArea,
  };

  const onFinish = (val) => {
    const formData = new FormData();
    if (val.type === null) {
      if (val.value !== null) {
        formData.append("type", selectedType);
      }
    } else {
      if (val.value !== null) {
        formData.append("type", val.type);
      }
    }
    if (val.itemOrder !== undefined && val.itemOrder !== null) {
      formData.append("itemOrder", val.itemOrder);
    } else {
      formData.append("itemOrder", contentLength + 1);
    }
    if (val.type === "image" || selectedType === "image") {
      if (val.value !== null) {
        formData.append("image", val.value.fileList[0].originFileObj);
      }
      // console.log('NATAWAG');
    } else if (val.type === "video" || selectedType === "video") {
      if (val.value !== null) {
        formData.append("video", val.value.fileList[0].originFileObj);
      }
    } else if (val.type === "text" || selectedType === "text") {
      formData.append("value", val.value);
    }

    if (isAdd) {
      formData.append("newsId", newsId);
      dispatch(addingContent({ body: formData }));
    } else {
      formData.append("contentId", contId);
      // console.log('EDIT CONTENT', val);
      dispatch(edittingContent({ body: formData }));
    }
    setIsOpenAddContent(false);
    formEditAddImg.resetFields();
    formEditAddVid.resetFields();
    formEditAddText.resetFields();
    setVideoPreview(null);
    setImagePreview(null);
    setContentLength(0);
    // setImageUrl(null);
    // setVideoUrl(null);

    // for (var pair of formData.entries()) {
    // 	console.log('pairrr', pair[0] + ', ' + pair[1]);
    // }
  };
  const onFinishFailed = ({ errorFields }) => {
    errorFields.reverse().forEach(({ name }) => {
      const fieldName = name[0];
      const ref = fieldRefs[fieldName];
      if (ref) {
        ref.current.focus();
      }
    });
  };

  const options = [];
  options.push(
    <Select.Option key={0} value={0}>
      First
    </Select.Option>
  );
  for (let i = 1; i <= contentLength - 1; i++) {
    options.push(
      <Select.Option key={i} value={i}>
        {i + 1}
      </Select.Option>
    );
  }
  options.push(
    <Select.Option key={contentLength + 1} value={contentLength + 1}>
      Last
    </Select.Option>
  );
  const initialValue = contentLength + 1;

  //IMAGE
  const props = {
    name: "image",
    accept: "image/png, image/jpeg",
    multiple: false,
    beforeUpload: async (file) => {
      setFile(file);
      setImagePreview(await getBase64(file));
      return false;
    },
  };
  const removeImg = () => {
    setImagePreview(null);
  };

  const { Dragger } = Upload;

  //video

  const vidProps = {
    name: "video",
    accept: "video/mp4, video/quicktime",
    // accept: 'image/png, image/jpeg',
    multiple: false,
    beforeUpload: async (file) => {
      setFileVid(file);
      setVideoPreview(await getBase64(file));
      return false;
    },
  };

  const removeVid = () => {
    setVideoPreview(null);
  };

  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#1C4E84", colorPrimaryBg: "#1C4E84" } }}>
      <div>
        {selectedType === "text" && (
          <Spin spinning={isLoading}>
            <Form onFinish={onFinish} onFinishFailed={onFinishFailed} layout="vertical" form={formEditAddText}>
              <Form.Item name="type" hidden initialValue="text">
                <Input hidden />
              </Form.Item>
              <Form.Item name="itemOrder" label="Item Order" initialValue={initialValue}>
                <Select placeholder="Choose placement">{options}</Select>
              </Form.Item>
              <Form.Item
                label={<p className=" text-[20px] m-0 font-semibold">Input text</p>}
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
                <TextArea ref={textArea} rows={8} />
              </Form.Item>
              <Form.Item>
                <Button className=" w-full h-12 rounded-lg mt-5 sm:text-lg text-base" type="default" htmlType="submit">
                  {isAdd ? "Add" : "Edit"}
                </Button>
              </Form.Item>
            </Form>
          </Spin>
        )}
        {selectedType === "image" && (
          <Spin spinning={isLoading}>
            {!imagePreview && imageUrl && (
              <div className=" py-5 px-10 flex justify-center items-center">
                <Image width={300} height={200} src={`${import.meta.env.VITE_BASE_URL}/${imageUrl}`} alt="/" />
              </div>
            )}
            <Form className=" max-w-[700px] mx-auto" onFinish={onFinish} layout="vertical" form={formEditAddImg}>
              <Form.Item name="type" hidden initialValue="image">
                <Input hidden />
              </Form.Item>
              <Form.Item name="itemOrder" label="Item Order" initialValue={initialValue}>
                <Select placeholder="Choose placement">{options}</Select>
              </Form.Item>
              <Form.Item
                label={<p className=" text-[20px] m-0 font-semibold">Upload image</p>}
                className="pt-2 text-[18px]"
                name="value"
              >
                {!imagePreview && (
                  <Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag image file to this area to upload</p>
                    <p className="ant-upload-hint">
                      To upload your Valid ID / Personal Document, drag and drop your image file in the drop zone
                    </p>
                  </Dragger>
                )}
              </Form.Item>
              {imagePreview && (
                <Space direction="vertical" className=" flex justify-center items-center">
                  <Image src={imagePreview}></Image>
                  <Space>
                    <Button type="default" onClick={removeImg}>
                      Remove
                    </Button>
                  </Space>
                </Space>
              )}
              <Form.Item>
                <Button className=" w-full h-12 rounded-lg mt-5 sm:text-lg text-base" type="default" htmlType="submit">
                  {isAdd ? "Add" : "Edit"}
                </Button>
              </Form.Item>
            </Form>
          </Spin>
        )}
        {selectedType === "video" && (
          <Spin spinning={isLoading}>
            {!imagePreview && videoUrl && (
              <div className=" py-5 px-10 flex justify-center items-center">
                <video width={400} loop={true} controls={true} src={`${import.meta.env.VITE_BASE_URL}/${videoUrl}`} />
              </div>
            )}
            <Form className=" max-w-[700px] mx-auto" onFinish={onFinish} layout="vertical" form={formEditAddVid}>
              <Form.Item name="type" hidden initialValue="video">
                <Input hidden />
              </Form.Item>
              <Form.Item name="itemOrder" label="Item Order" initialValue={initialValue}>
                <Select placeholder="Choose placement">{options}</Select>
              </Form.Item>
              <Form.Item
                label={<p className=" text-[20px] m-0 font-semibold">Upload video</p>}
                className="pt-2 text-[18px]"
                name="value"
              >
                {!videoPreview && (
                  <Dragger {...vidProps}>
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
                    muted={true}
                    controls={true}
                    src={videoPreview}
                  />

                  <Space>
                    <Button type="default" onClick={removeVid}>
                      Remove
                    </Button>
                  </Space>
                </Space>
              )}
              <Form.Item>
                <Button className=" w-full h-12 rounded-lg mt-5 sm:text-lg text-base" type="default" htmlType="submit">
                  {isAdd ? "Add" : "Edit"}
                </Button>
              </Form.Item>
            </Form>
          </Spin>
        )}
      </div>
    </ConfigProvider>
  );
};

export default EditAddForm;
