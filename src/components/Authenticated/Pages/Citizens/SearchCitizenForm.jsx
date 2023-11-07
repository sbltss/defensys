import { Col, Form, Input, Row, message } from "antd";
import React from "react";
import { searchCitizenByCC } from "../../../../store/api/citizen-api";
import Button from "../../../UI/Button/Button";
import { SearchIcon } from "../../../../assets/icons/Icons";

const SearchCitizenForm = ({ setLoading, setCitizens, loading }) => {
  const searchCitizenHandler = async (e) => {
    setLoading(true);
    const response = await searchCitizenByCC(e);
    if (!response.data.length) message.info("No results found");
    setCitizens(response.data);
    setLoading(false);
  };
  return (
    <Form
      onFinish={searchCitizenHandler}
      requiredMark="optional"
      labelAlign="left"
      layout="vertical"
    >
      <Row gutter={8}>
        <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
          <Form.Item name={"accountId"} label="Account ID">
            <Input placeholder={"Input account ID"} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
          <Form.Item name={"firstName"} label="First name">
            <Input placeholder={"Input first name"} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
          <Form.Item name={"lastName"} label="Last name">
            <Input placeholder={"Input last name"} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
          <Form.Item name={"username"} label="Username">
            <Input placeholder={"Input username"} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
          <Form.Item name={"email"} label="Email address">
            <Input placeholder={"Input email address"} />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <div className="flex flex-row justify-center">
            <Button
              type={"primary"}
              text={"Search"}
              loading={loading}
              Icon={SearchIcon}
            />
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchCitizenForm;
