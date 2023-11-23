import { Form, Input, Modal, message, Upload } from "antd";
import React, { useState } from "react";
import { PlusOutlined } from '@ant-design/icons';
import { addUpdate } from "../../../../../../store/api/ticket-api";

const AddUpdate = ({ open, setOpen, transactionNumber }) => {
  const [form] = Form.useForm();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const onFinishHandler = async (values) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("message", values.update);
    formData.append("transactionNumber", transactionNumber);
    if (values?.upload?.fileList) {
      for (let i = 0; i < values?.upload?.fileList?.length; i++) {
        formData.append("ticketImage", values?.upload?.fileList[i]?.originFileObj);
      }
    }
    const result = await addUpdate({
      body: formData,
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

  return (
    <Modal
      title="Add Update"
      open={open}
      confirmLoading={loading}
      onOk={() => form.submit()}
      okButtonProps={{
        className:
          "border-primary-900 bg-primary-700 hover:bg-primary-800 text-gray-100 ",
      }}
      // confirmLoading={confirmLoading}
      onCancel={() => setOpen(false)}
    >
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

export default AddUpdate;
