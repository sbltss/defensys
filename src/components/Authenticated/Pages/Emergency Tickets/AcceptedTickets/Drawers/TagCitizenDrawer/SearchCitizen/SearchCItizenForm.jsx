import { Col, Form, Input, Row } from "antd";
import React from "react";
import Button from "../../../../../../../UI/Button/Button";

const SearchCitizenForm = ({ form, searchCitizenHandler, loading }) => {
  return (
    <Form
      form={form}
      onFinish={searchCitizenHandler}
      requiredMark="optional"
      labelAlign="left"
      layout="vertical"
    >
      <Row gutter={8}>
        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={6}>
          <Form.Item name={"accountId"} label="Account ID">
            <Input placeholder={"Input account ID"} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={6}>
          <Form.Item name={"firstName"} label="First name">
            <Input placeholder={"Input first name"} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={6}>
          <Form.Item name={"lastName"} label="Last name">
            <Input placeholder={"Input last name"} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={6}>
          <Form.Item
            name="mobileNumber"
            label="Contact Number"
            rules={[
              {
                pattern: /^9[0-9]{9}$/,
                message: "Please enter a valid contact number",
              },
            ]}
          >
            <Input
              type="number"
              style={{
                width: "100%",
              }}
              addonBefore="+63"
              placeholder="9XXXXXXXXX"
            />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <div className="flex flex-row justify-center">
            <Button
              type={"primary"}
              text={"Search for registered citizen"}
              loading={loading}
            />
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchCitizenForm;
