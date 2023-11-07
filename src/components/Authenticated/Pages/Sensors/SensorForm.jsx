import { Col, Form, Input, Row, Select, message } from "antd";
import React, { useEffect } from "react";
import { addSensor, updateSensor } from "../../../../store/api/resources-api";

const SensorForm = ({ form, mode, setMode, reload, loading, setLoading }) => {
  const addSensorHandler = async (e) => {
    setLoading(true);
    const request = await addSensor(e);
    if (request.name === "AxiosError")
      message.error(request.response.data.message);
    else {
      message.success(request.data.message);
      reload();
      setLoading(false);
      form.resetFields();
      setMode(null);
    }
  };
  const updateSensorHandler = async (e) => {
    setLoading(true);
    const request = await updateSensor(e);
    if (request.name === "AxiosError")
      message.error(request.response.data.message);
    else {
      message.success(request.data.message);
      reload();
      setLoading(false);
      form.resetFields();
      setMode(null);
    }
  };
  const onFinishHandler = (e) => {
    if (mode === "add") {
      const body = e;
      addSensorHandler({ body });
    } else {
      const { sensorId, ...body } = e;
      updateSensorHandler({ body, param: sensorId });
    }
  };

  useEffect(() => {
    form.resetFields();
    if (mode && mode !== "add" && mode) {
      form.setFieldsValue({
        ...mode,
      });
    }
  }, [mode, form]);
  return (
    <Form
      layout="vertical"
      requiredMark={"optional"}
      form={form}
      onFinish={onFinishHandler}
    >
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="sensorId"
            label="Sensor ID"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input
              readOnly={mode !== "add"}
              placeholder="Please enter sensor id"
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="type"
            label="Type"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select placeholder="Select Type" disabled={mode !== "add"}>
              <Select.Option value="weather">Weather</Select.Option>
              <Select.Option value="flood">Flood</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: "Please enter sensor name",
              },
            ]}
          >
            <Input placeholder="Please enter sensor name" />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="address"
            label="Location"
            rules={[
              {
                required: true,
                message: "Please enter sensor location",
              },
            ]}
          >
            <Input placeholder="Please enter sensor longitude" />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="latitude"
            label="Latitude"
            rules={[
              {
                required: true,
                message: "Please enter sensor latitude",
              },
            ]}
          >
            <Input placeholder="Please enter sensor latitude" />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="longitude"
            label="Longitude"
            rules={[
              {
                required: true,
                message: "Please enter sensor longitude",
              },
            ]}
          >
            <Input placeholder="Please enter sensor longitude" />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default SensorForm;
