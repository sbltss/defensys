import { Checkbox, Col, DatePicker, Form, Input, Row } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { resourcesActions } from "../../../../../store/store";
const { updateAccount, addAccount } = resourcesActions;

const ContentWriterForm = ({ form, type, selectedAccount }) => {
  const [changePassword, setChangePassword] = useState(false);
  const dispatch = useDispatch();
  const onFinishHandler = (e) => {
    if (type === "add") {
      const body = {
        ...e,
      };
      dispatch(
        addAccount({
          listType: "contentWriters",
          body: body,
        })
      );
    } else {
      const body = {
        ...e,
      };
      delete body.password;
      if (changePassword) body.password = "Defensys2023";
      delete body.accountId;
      dispatch(
        updateAccount({
          listType: "contentWriters",
          body: body,
          accountId: e.accountId,
        })
      );
    }
  };

  useEffect(() => {
    form.resetFields();
    if (type === "edit" && selectedAccount) {
      form.setFieldsValue({
        ...selectedAccount,
        birthdate: moment(selectedAccount.birthdate),
        password: "",
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
        {type === "edit" && (
          <Col span={24}>
            <Form.Item
              name="accountId"
              label="Account ID"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input readOnly />
            </Form.Item>
          </Col>
        )}
        <Col span={24}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                message: "Please enter email address",
              },
              {
                type: "email",
                message: "Please enter a valid email address",
              },
            ]}
          >
            <Input
              // readOnly={type === "edit"}
              style={{
                width: "100%",
              }}
              placeholder="Please enter email address"
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[
              {
                required: true,
                message: "Please enter first name",
              },
            ]}
          >
            <Input placeholder="Please enter first name" />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[
              {
                required: true,
                message: "Please enter last name",
              },
            ]}
          >
            <Input placeholder="Please enter last name" />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="contactNumber"
            label="Contact Number"
            rules={[
              {
                required: true,
                message: "Please enter contact number",
              },
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
        {type === "edit" && (
          <>
            <Col span={24}>
              <Checkbox
                checked={changePassword}
                onChange={() => setChangePassword(!changePassword)}
              >
                Reset password?
              </Checkbox>
            </Col>
            {/* {changePassword && (
              <Col span={24}>
                <Form.Item
                  name="password"
                  label=""
                  rules={[
                    {
                      required: true,
                      message: "Please enter new password",
                    },
                  ]}
                >
                  <Input type="password" placeholder="Enter new password" />
                </Form.Item>
              </Col>
            )} */}
          </>
        )}
      </Row>
    </Form>
  );
};

export default ContentWriterForm;
