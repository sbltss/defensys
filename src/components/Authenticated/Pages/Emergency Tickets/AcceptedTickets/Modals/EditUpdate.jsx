import { Form, Input, Modal, message, Upload, Image, Space } from "antd";
import React, { useEffect, useState } from "react";
import { PlusOutlined } from '@ant-design/icons';
import { editUpdate, removeImageUpdate } from "../../../../../../store/api/ticket-api";
import Button from "../../../../../UI/Button/Button";

const EditUpdate = ({ open, setOpen }) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const onRemoveHandler = async (value) => {
    setLoading(true);
    const result = await removeImageUpdate({
      body: { imgUrlToRemove: value },
      param: open.id,
    });
    if (!result || result.name === "AxiosError") {
      message.error(result?.response.data.message);
    } else {
      form.resetFields();
      message.success(result.data.message);
      setOpen(null);
    }
    setLoading(false);
  }

  const onFinishHandler = async (values) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("message", values.update);
    if (values?.upload?.fileList) {
      for (let i = 0; i < values?.upload?.fileList?.length; i++) {
        formData.append("ticketImage", values?.upload?.fileList[i]?.originFileObj);
      }
    }
    const result = await editUpdate({
      body: formData,
      param: open.id,
    });
    if (!result || result.name === "AxiosError") {
      message.error(result?.response.data.message);
    } else {
      form.resetFields();
      message.success(result.data.message);
      setOpen(false);
    }

    setLoading(false);
  };

  const props = {
    accept: ".png, .jpg, .jpeg, .gif, .tiff",
    multiple: false,
    beforeUpload: (file) => {
      const isLt2M = file.size / 300 / 300 < 2;
      if (!isLt2M) {
        console.log('test')
      }
      return false;
    },
    onChange(info) {
      if (info.file.status !== "removed") {
          let reader = new FileReader();
          reader.readAsDataURL(info.file);
      }
    },
    async onPreview(file) {
      setPreviewImage(file.url || file.thumbUrl);
      setPreviewVisible(true);
      setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    },
  };

  useEffect(() => {
    if (open) form.setFieldsValue({ update: open.message });
  }, [open, form]);
  return (
    <Modal
      title="Edit Update"
      open={open}
      onOk={() => form.submit()}
      okButtonProps={{
        className:
          "border-primary-900 bg-primary-700 hover:bg-primary-800 text-gray-100 ",
      }}
      confirmLoading={loading}
      onCancel={() => setOpen(null)}
    >
      {open?.imgUrl?.split(";;;").map(e => {
        return e ? <Space className=" flex justify-center items-center mb-4">
          <Image
            key={e}
            width={200}
            src={import.meta.env.VITE_BASE_URL + '/' + e}
          />
          <Button
            text="Remove"
            type="danger"
            onClick={() => onRemoveHandler(e)}
          />
        </Space> : null
      })}
      <Form
        form={form}
        layout="vertical"
        requiredMark="optional"
        onFinish={onFinishHandler}
      >
        <Form.Item
          name="upload"
          validateTrigger={['onChange', 'onBlur']}
        >
          <Upload
            listType="picture-card"
            {...props}
            maxCount={5}
          >
              <div>
                  <PlusOutlined />
                  <div
                      style={{
                          marginTop: 8,
                      }}
                  >
                      Upload
                  </div>
              </div>
          </Upload>
        </Form.Item>
        <Form.Item
          name="update"
          rules={[
            {
              required: true,
              message: "Please provide your update",
            },
          ]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
      <Modal
        open={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img
          alt="example"
          style={{
            width: '100%',
          }}
          src={previewImage}
        />
      </Modal>
    </Modal>
  );
};

export default EditUpdate;
