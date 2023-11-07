import { Col, Form, Input, Modal, Row } from "antd";
import React from "react";
import { searchCitizen } from "../../../../../../store/api/citizen-api";
import Button from "../../../../../UI/Button/Button";

const SearchCitizenForm = ({
  form,
  searchCitizenHandler,
  setReportingCitizen,
  setOpen,
  loading,
}) => {
  const fields = Form.useWatch(null, form);
  const addAsNonRegisteredHandler = async () => {
    if (!fields.firstName?.trim() || !fields.lastName?.trim())
      return Modal.warning({
        okButtonProps: {
          className:
            "border-primary-900 bg-primary-700 hover:bg-primary-800 text-gray-100 ",
        },
        title: "Complete the fields",
        content:
          "First name, last name, and contact number is required for non registered citizen",
      });
    if (fields.mobileNumber?.trim()) {
      const response = await searchCitizen({
        mobileNumber: fields.mobileNumber,
      });
      if (response.data.length > 0)
        return Modal.confirm({
          title: "Duplicate number",
          content: (
            <div className="flex flex-col">
              <p>The number you provided is already in used by:</p>
              <span>
                Account ID:{" "}
                <span className="font-medium">
                  {response.data[0].accountId}
                </span>
              </span>
              <span>
                Name:{" "}
                <span className="font-medium">{`${response.data[0].firstName} ${response.data[0].lastName}`}</span>
              </span>
              <br />
              <p>
                Do you want to continue with this account instead? Otherwise
                change the mobile number
              </p>
            </div>
          ),
          okText: "Yes",
          cancelText: "Change number",
          onOk() {
            setOpen(false);
            setReportingCitizen(response.data[0]);
          },
          onCancel() {},
          closable: true,
          okButtonProps: {
            className:
              "border-primary-900 bg-primary-700 hover:bg-primary-800 text-gray-100 ",
          },
          cancelButtonProps: {
            className:
              "border-gray-400 bg-gray-300 hover:bg-gray-400 text-gray-800 ",
          },
        });
    }

    setOpen();
    setReportingCitizen({
      firstName: fields.firstName,
      lastName: fields.lastName,
      mobileNumber: fields.mobileNumber?.trim() ? fields.mobileNumber : "",
    });
  };
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
              htmlType="button"
              type={"warning"}
              text={"Unknown caller"}
              disabled={loading}
              onClick={() => {
                setOpen();
                setReportingCitizen({
                  firstName: "Unknown",
                  lastName: "Caller",
                  mobileNumber: "",
                });
              }}
            />
            <Button
              htmlType="button"
              type={"muted"}
              text={"Non registered citizen"}
              onClick={addAsNonRegisteredHandler}
              disabled={loading}
            />
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
