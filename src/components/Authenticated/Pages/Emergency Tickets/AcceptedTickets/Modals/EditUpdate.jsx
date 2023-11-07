import { Form, Input, Modal, message } from "antd";
import React, { useEffect, useState } from "react";
import { editUpdate } from "../../../../../../store/api/ticket-api";

const EditUpdate = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const onFinishHandler = async (values) => {
    setLoading(true);
    const result = await editUpdate({
      body: { message: values.update },
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

export default EditUpdate;
