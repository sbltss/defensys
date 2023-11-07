import { Col, Drawer, Form, Input, Row, message } from "antd";
import React, { useEffect, useState } from "react";
import {
  addVolunteerGroup,
  updateVolunteerGroup,
} from "../../../../../../../store/api/resources-api";
import Button from "../../../../../../UI/Button/Button";

const VolunteerGroupsForm = ({ mode, onClose, reloadTable }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinishHandler = async (e) => {
    setLoading(true);

    let request;
    if (mode === "adding") request = await addVolunteerGroup({ body: e });
    else
      request = await updateVolunteerGroup({
        body: e,
        param: mode.volunteerId,
      });

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
    if (mode && mode != "adding") {
      form.setFieldsValue(mode);
    } else form.resetFields();
  }, [mode]);

  return (
    <Drawer
      placement="right"
      title={
        mode !== "adding"
          ? "Edit Volunteer Groups Information"
          : "Create a Volunteer Groups"
      }
      onClose={onClose}
      open={!!mode}
      width={"400px"}
      footer={
        <div className="w-full flex flex-row justify-end">
          <Button
            loading={loading}
            text={
              mode !== "adding"
                ? "Update Volunteer Groups"
                : "Create Volunteer Groups"
            }
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
              name="name"
              label="Volunteer Groups Name"
              rules={[
                {
                  required: true,
                  message: "Please enter volunteer group name",
                },
              ]}
            >
              <Input placeholder="Please enter volunteer group name" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="type"
              label="Type"
              rules={[
                {
                  required: true,
                  message: "Please enter type",
                },
              ]}
            >
              <Input placeholder="Please enter type" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="address"
              label="Address"
              rules={[
                {
                  required: true,
                  message: "Please enter address",
                },
              ]}
            >
              <Input placeholder="Please enter address" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default VolunteerGroupsForm;
