import { Drawer, Form, Input, message } from "antd";
import React, { useEffect } from "react";
import { useState } from "react";
import Button from "../../../../../../UI/Button/Button";
import {
  addAccounType,
  updateAccountType,
} from "../../../../../../../store/api/resources-api";

const DeptTypeForm = ({ selectedType, adding, onClose, reload }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedType) {
      form.setFieldsValue(selectedType);
    } else form.resetFields();
  }, [selectedType]);

  const onFinishHandler = async (e) => {
    setLoading(true);
    let result;

    if (adding) {
      result = await addAccounType({ body: e });
    } else {
      result = await updateAccountType({ param: selectedType.id, body: e });
    }

    if (result.name === "AxiosError") {
      message.error(result.response.data.message);
    } else {
      message.success(result.data.message);
      reload();
      onClose();
    }

    setLoading(false);
  };
  return (
    <Drawer
      placement="right"
      width={"400"}
      title={
        adding ? "Add new department type" : "Update existing account type"
      }
      open={!!selectedType || adding}
      onClose={onClose}
      footer={
        <div className="flex flex-row justify-end items-center">
          <Button text="Submit" type="primary" onClick={form.submit} />
        </div>
      }
    >
      <Form
        onFinish={onFinishHandler}
        form={form}
        disabled={loading}
        layout="vertical"
      >
        <Form.Item label="Department type name" name="typeName">
          <Input placeholder="Input department type name" />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default DeptTypeForm;
