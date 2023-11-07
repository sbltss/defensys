import { Col, Drawer, Form, Input, Row, message } from "antd";
import React, { useEffect, useState } from "react";
import { updateAppVersions } from "../../../../../store/api/resources-api";
import Button from "../../../../UI/Button/Button";

const AppVersionForm = ({ mode, onClose, reloadTable }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinishHandler = async (e) => {
    setLoading(true);
    let request = await updateAppVersions({
      body: { ...e, id: mode.id },
    });

    if (request.name === "AxiosError") {
      message.error(request.response.data.message);
    } else {
      reloadTable();
      onClose();
    }

    setLoading(false);
  };

  useEffect(() => {
    if (mode) {
      form.setFieldsValue(mode);
    } else form.resetFields();
  }, [mode]);
  return (
    <Drawer
      placement="right"
      title={"Edit App Version"}
      onClose={onClose}
      open={!!mode}
      width={"600px"}
      footer={
        <div className="w-full flex flex-row justify-end">
          <Button
            loading={loading}
            text={"Update App Version"}
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
              name="currentVersion"
              label="Current Version"
              rules={[
                {
                  required: true,
                  message: "Please enter current version",
                },
              ]}
            >
              <Input placeholder="Please enter current version" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="supportedVersion"
              label="Supported Version"
              rules={[
                {
                  required: true,
                  message: "Please enter supported version",
                },
              ]}
            >
              <Input placeholder="Please enter supported version" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="storeLink"
              label="Store Link"
              rules={[
                {
                  required: true,
                  message: "Please enter store link",
                },
              ]}
            >
              <Input placeholder="Please enter store link" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="directLink"
              label="Direct link"
              rules={[
                {
                  required: true,
                  message: "Please enter direct link",
                },
              ]}
            >
              <Input placeholder="Please enter direct link" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default AppVersionForm;
