import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Image,
  Input,
  Modal,
  Space,
  Upload,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import moment from "moment";
import React from "react";
import { useDispatch } from "react-redux";
// import { updatingNews } from "../../../store/slices/news/newsSlice";
import { updatingNews } from "../../../../../store/slices/news-slice";
import { getBase64 } from "../../../../../helpers/base64";

const EditNewsForm = ({
  setFileEdit,
  setImageEditPreview,
  isOpenEdit,
  setIsOpenEdit,
  formEdit,
  imageEditPreview,
  setMainEdit,
  mainEdit,
  setNewsId,
  newsId,
  fileEdit,
  isLoading,
  setCoverUrl,
  coverUrl,
  prevCover,
  // onFinishEdit,
  // handleTest,
}) => {
  const dispatch = useDispatch();
  const props = {
    name: "value",
    accept: "image/png, image/jpeg",
    multiple: false,
    beforeUpload: async (file) => {
      setFileEdit(file);
      setImageEditPreview(await getBase64(file));
      return false;
    },
  };

  const handleCancel = () => {
    setIsOpenEdit(false);
    setImageEditPreview(null);
    // formEdit.resetFields();
    setMainEdit({});
    setNewsId({});
    setFileEdit(null);
    setCoverUrl(null);
  };

  const onFinishEdit = async (values) => {
    const convertDate = values.subtitle.toDate();
    const formattedDate = moment(convertDate).format("YYYY-MM-DD HH:mm:ss");

    const newValues = {
      ...values,
      coverUrl: values?.coverUrl?.fileList[0].originFileObj,
      subtitle: formattedDate,
    };
    setMainEdit(newValues);

    const formData = new FormData();

    // add subtitle to form data
    // formData.append('subtitle', moment(mainEdit.subtitle).format('YYYY-MM-DD HH:mm:ss'));
    formData.append("subtitle", mainEdit.subtitle);

    // add headline to form data
    formData.append("headline", mainEdit.headline);

    formData.append("sourceLink", values.sourceLink);

    // add cover image file to form data
    // formData.append('coverImage', mainEdit.coverUrl);
    if (mainEdit.coverUrl !== null && mainEdit.coverUrl !== undefined) {
      formData.append("cover", mainEdit.coverUrl);
    }
    // for (var pair of formData.entries()) {
    // 	console.log('pairrr', pair[0] + ', ' + pair[1]);
    // }

    dispatch(updatingNews({ params: newsId, body: formData }));
    // formEdit.resetFields();

    setIsOpenEdit(false);
    setImageEditPreview(null);
    setMainEdit({});
    setNewsId({});
    setFileEdit(null);
    setCoverUrl(null);

    // console.log('RESULT', result);
  };

  const onChangeValues = (changedValues, allValues) => {
    if (changedValues.coverUrl) {
      const file = changedValues.coverUrl.fileList[0].originFileObj;
      // setMainEdit({ subtitle: allValues.subtitle, headline: allValues.headline, coverUrl: file });
      setMainEdit({ ...mainEdit, coverUrl: file });
      setCoverUrl(null);
    } else if (changedValues.subtitle) {
      const formattedDate = moment(changedValues.subtitle).format(
        "YYYY-MM-DD HH:mm:ss"
      );

      setMainEdit({
        ...mainEdit,
        // subtitle: formattedDate,
        subtitle: changedValues.subtitle,
      });
    } else if (changedValues.headline) {
      setMainEdit({ ...mainEdit, headline: changedValues.headline });
    }
  };

  const removeImg = (fieldName) => {
    setImageEditPreview(null);
    setCoverUrl(prevCover);
    formEdit.resetFields([fieldName]);
    if (fieldName === "coverUrl") {
      // If so, update the mainEdit state to remove the coverUrl property
      setMainEdit((prevMainEdit) => {
        const { coverUrl, ...newMainEdit } = prevMainEdit;
        return newMainEdit;
      });
    }
  };

  return (
    <div className=" pt-20">
      <Modal
        centered
        title={<h1 className=" text-2xl font-semibold">Edit headline</h1>}
        open={isOpenEdit}
        // onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ style: { display: "none" } }}
        width={800}
      >
        <div className=" flex flex-col items-center justify-center bg-[#eeeeee] pb-4 pt-8 w-full col-span-4">
          <div className=" flex justify-center items-center max-w-[400px] transition-all duration-150">
            {coverUrl && (
              <Image
                // className=" w-full h-full rounded-md"
                src={`${import.meta.env.VITE_BASE_URL}/${coverUrl}`}
                alt="/"
              />
            )}
            {imageEditPreview && (
              <Space
                direction="vertical"
                className=" flex justify-center items-center col-span-4"
              >
                <Image src={imageEditPreview}></Image>
                <Space>
                  <Button type="primary" onClick={() => removeImg("coverUrl")}>
                    Remove
                  </Button>
                </Space>
              </Space>
            )}
          </div>
          <div className=" px-5">
            <h1 className=" text-[#1e293b] font-bold text-center mt-8 sm:text-[26px] text-[24px]">
              {mainEdit?.headline}
            </h1>
            <p className=" text-defblue text-center sm:text-[16px] text-[14px]">
              {/* {mainEdit?.subtitle && moment(mainEdit.subtitle).format('LL')} */}
              {dayjs(mainEdit.subtitle).format("MMMM DD, YYYY")}
            </p>
          </div>
        </div>
        <Form
          name="headlineForm"
          className=" max-w-[1000px] mx-auto bg-white px-5 pt-5 pb-20 shadow-lg rounded-md grid grid-cols-4 relative"
          onFinish={onFinishEdit}
          // onFinishFailed={onFinishFailed}
          layout="vertical"
          form={formEdit}
          // form={form1}
          onValuesChange={onChangeValues}
        >
          <Form.Item
            label={
              <p className=" md:text-[20px] text-[18px] font-semibold m-0">
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
            <TextArea
              // ref={headline}
              // onChange={onTextChange}
              rows={2}
            />
            {/* <Input size='middle'/> */}
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
            name="coverUrl"
            className="pt-2 sm:col-span-2 col-span-4"
          >
            <Upload
              {...props}
              maxCount={1}
              multiple={false}
              showUploadList={false}
            >
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
            <Input />
          </Form.Item>
          <Button
            htmlType="submit"
            size="large"
            type="default"
            className=" sm:absolute bottom-5 left-5 max-w-[120px]"
            block
            disabled={isLoading}
          >
            Save
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default EditNewsForm;
