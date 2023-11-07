import { Col, Drawer, Form, Input, Row, message } from "antd";
import React, { useEffect } from "react";
import Button from "../../../../../../UI/Button/Button";
import { useState } from "react";
import {
  addBarangay,
  updateBarangay,
} from "../../../../../../../store/api/resources-api";

const BarangayForm = ({ mode, onClose, reloadTable }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinishHandler = async (e) => {
    setLoading(true);

    let request;
    if (mode === "adding") request = await addBarangay({ body: e });
    else request = await updateBarangay({ body: e, param: mode.brgyCode });

    if (request.name === "AxiosError") {
      message.error(request.response.data.message);
    } else {
      reloadTable();
      message.success(request.data.message);
      onClose();
    }

    setLoading(false);
  };

  useEffect(() => {
    if (mode && mode !== "adding") {
      form.setFieldsValue(mode);
    } else form.resetFields();
  }, [mode]);

  return (
    <Drawer
      placement="right"
      title={
        mode !== "adding" ? "Edit Barangay Information" : "Create a Barangay"
      }
      onClose={onClose}
      open={!!mode}
      width={"400px"}
      footer={
        <div className="w-full flex flex-row justify-end">
          <Button
            loading={loading}
            text={mode !== "adding" ? "Update Barangay" : "Create Barangay"}
            type="primary"
            onClick={() => form.submit()}
          />
        </div>
      }
    >
      <Form
        layout="vertical"
        requiredMark={"optional"}
        form={form}
        disabled={loading}
        onFinish={onFinishHandler}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="brgyCode"
              label="Barangay ID"
              rules={[
                {
                  required: true,
                  message: "Please enter barangay id",
                },
              ]}
            >
              <Input
                readOnly={mode !== "adding"}
                placeholder="Please enter barangay id"
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="name"
              label="Barangay Name"
              rules={[
                {
                  required: true,
                  message: "Please enter barangay name",
                },
              ]}
            >
              <Input placeholder="Please enter barangay name" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default BarangayForm;
