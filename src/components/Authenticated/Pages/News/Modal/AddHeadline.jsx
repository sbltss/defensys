import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  ConfigProvider,
  DatePicker,
  Form,
  Input,
  Spin,
  Upload,
} from "antd";
import moment from "moment";
import React, { useRef } from "react";
import { useSelector } from "react-redux";

const AddHeadline = ({
  setMainData,
  mainData,
  setFile,
  setImagePreview,
  handleAddContent,
  form1,
  setIsOpenAddNews,
}) => {
  // const [form] = Form.useForm();
  const { isLoading } = useSelector((state) => state.news);

  const headline = useRef(null);
  const subtitle = useRef(null);
  const sourceLink = useRef(null);
  const fieldRefs = {
    headline: headline,
    subtitle: subtitle,
    sourceLink,
  };
  const onFinish = (values) => {
    const convertDate = values.subtitle.toDate();
    const formattedDate = moment(convertDate).format("YYYY-MM-DD HH:mm:ss");

    const newValues = {
      ...values,
      coverURL: values.coverURL.fileList[0].originFileObj,
      subtitle: formattedDate,
    };

    setMainData(newValues);
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
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result);

      reader.onerror = (error) => reject(error);
    });

  const props = {
    name: "fileList",
    accept: "image/png, image/jpeg",
    multiple: false,
    beforeUpload: async (file) => {
      setFile(file);
      setImagePreview(await getBase64(file));
      return false;
    },
  };

  const onChangeValues = (changedValues, allValues) => {
    // console.log('allvalues', allValues);
    if (changedValues.coverURL) {
      const file = changedValues.coverURL.fileList[0].originFileObj;
      setMainData({ ...mainData, coverURL: file });
    } else if (changedValues.subtitle) {
      const convertDate = changedValues.subtitle.toDate();
      const formattedDate = moment(convertDate).format("YYYY-MM-DD HH:mm:ss");
      setMainData({ ...mainData, subtitle: formattedDate });
    } else {
      const { subtitle, ...restValues } = allValues;
      setMainData({ ...mainData, ...restValues });
    }
  };

  const handleSubmit = () => {
    if (mainData.coverURL && mainData.headline && mainData.subtitle) {
      setIsOpenAddNews(true);
    }
  };

  const { TextArea } = Input;

  return (
    <div className=" mt-10">
      <Spin spinning={isLoading}>
        <Form
          name="headlineForm"
          className=" max-w-[700px] mx-auto bg-white px-10 pt-5 pb-10 shadow-lg rounded-md grid grid-cols-4 relative"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
          form={form1}
          onValuesChange={onChangeValues}
        >
          <Form.Item
            label={
              <p className=" md:text-[20px] text-[18px] pt-10 font-semibold m-0">
                News Title
              </p>
            }
            className="pt-2 text-[18px] col-span-4"
            name="headline"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please input news title!",
              },
            ]}
          >
            <TextArea ref={headline} rows={2} />
          </Form.Item>
          <Form.Item
            label={
              <p className=" md:text-[20px] text-[18px] m-0 font-semibold">
                Date
              </p>
            }
            className="pt-2 text-[18px] sm:col-span-2 col-span-4"
            name="subtitle"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please select date!",
              },
            ]}
          >
            <DatePicker
              size="middle"
              disabledDate={(e) => {
                const now = new Date();
                return e.$d.valueOf() > now.valueOf();
              }}
            />
          </Form.Item>
          <Form.Item
            label={
              <p className=" md:text-[20px] text-[18px] m-0 font-semibold">
                Cover image
              </p>
            }
            name="coverURL"
            className="pt-2 sm:col-span-2 col-span-4"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please upload cover image",
              },
            ]}
          >
            <Upload {...props} maxCount={1} multiple={false}>
              <Button icon={<UploadOutlined />}>Upload Cover Image</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            label={
              <p className=" md:text-[20px] text-[18px] pt-10 font-semibold m-0">
                News source link
              </p>
            }
            className="pt-2 text-[18px] col-span-4"
            name="sourceLink"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please input source link",
              },
            ]}
          >
            <Input ref={sourceLink} />
          </Form.Item>
          <div className=" col-span-4 flex justify-center items-center pb-5 pt-10">
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "#808080",
                },
              }}
            >
              <Button
                type="default"
                onClick={handleAddContent}
                // className=" absolute right-5 bottom-5"
                className=" col-span-4 max-w-[400px]"
                size="large"
                block
              >
                Add Content
              </Button>
            </ConfigProvider>
          </div>
          <div className=" col-span-4 flex justify-center items-center pb-5 pt-2 ">
            <Button
              htmlType="submit"
              size="large"
              type="default"
              block
              className=" col-span-4 max-w-[150px]"
              onClick={handleSubmit}
            >
              Publish News
            </Button>
          </div>
        </Form>
      </Spin>
    </div>
  );
};

export default AddHeadline;
