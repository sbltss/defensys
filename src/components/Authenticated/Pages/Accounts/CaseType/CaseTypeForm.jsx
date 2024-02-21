import { Checkbox, Col, DatePicker, Form, Input, Row, Select } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { resourcesActions } from "../../../../../store/store";
const { updateAccount, addCaseType, updateCaseType } = resourcesActions;

const CaseTypeForm = ({ form, type, selectedAccount }) => {
  const dispatch = useDispatch();
  const onFinishHandler = (e) => {
    if (type === "add") {
      const body = {
        ...e,
      };
      dispatch(
        addCaseType({
          listType: "addCaseType",
          body: body,
        })
      );
    } else {
      const body = {
        ...e,
      };
      dispatch(
        updateCaseType({
          listType: "updateCaseType",
          body: body,
          id: selectedAccount.id,
        })
      );
    }
  };

  useEffect(() => {
    form.resetFields();
    console.log(type);
    if (type === "edit" && selectedAccount) {
      console.log(selectedAccount);
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
            name="typeName"
            label="Type Name"
            rules={[
              {
                required: true,
                message: "Please enter type name",
              },
            ]}
          >
            <Input placeholder="Please enter type name" />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="emergencyType"
            label="Emergency Type"
            rules={[
              {
                required: true,
                message: "Please select an emegency type",
              },
            ]}
          >
            <Select placeholder="Please select an emegency type">
              <Select.Option value={0}>Non-emergency</Select.Option>
              <Select.Option value={1}>Emergency</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default CaseTypeForm;
