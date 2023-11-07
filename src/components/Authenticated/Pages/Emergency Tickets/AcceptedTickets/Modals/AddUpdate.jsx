import { Form, Input, Modal, message } from "antd";
import React, { useState } from "react";
import { addUpdate } from "../../../../../../store/api/ticket-api";

const AddUpdate = ({ open, setOpen, transactionNumber }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const onFinishHandler = async (values) => {
    setLoading(true);
    const result = await addUpdate({
      body: { message: values.update, transactionNumber },
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
    </Modal>
  );
};

export default AddUpdate;
