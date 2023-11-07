import { Col, Form, Input, Row } from "antd";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { resourcesActions } from "../../../../../store/store";
const { updateAccount, addAccount } = resourcesActions;

const DeviceForm = ({ form, type, selectedAccount }) => {
  const dispatch = useDispatch();
  const onFinishHandler = (e) => {
    if (type === "add") {
      const body = {
        ...e,
      };
      dispatch(
        addAccount({
          listType: "deviceList",
          body: body,
        })
      );
    } else {
      const body = {
        ...e,
      };
      delete body.macAddress;
      dispatch(
        updateAccount({
          listType: "deviceList",
          body: body,
          accountId: e.macAddress,
        })
      );
    }
  };

  useEffect(() => {
    form.resetFields();
    if (type === "edit" && selectedAccount) {
      form.setFieldsValue({
        ...selectedAccount,
      });
    }
  }, [type, selectedAccount, form]);
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
            name="macAddress"
            label="Mac Address"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input
              readOnly={type === "edit"}
              placeholder="Please enter mac address"
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: "Please enter device name",
              },
            ]}
          >
            <Input placeholder="Please enter device name" />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="location"
            label="Location"
            rules={[
              {
                required: true,
                message: "Please enter device location",
              },
            ]}
          >
            <Input placeholder="Please enter device longitude" />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="latitude"
            label="Latitude"
            rules={[
              {
                required: true,
                message: "Please enter device latitude",
              },
            ]}
          >
            <Input placeholder="Please enter device latitude" />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="longitude"
            label="Longitude"
            rules={[
              {
                required: true,
                message: "Please enter device longitude",
              },
            ]}
          >
            <Input placeholder="Please enter device longitude" />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default DeviceForm;
