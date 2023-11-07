import { Checkbox, Col, Form, Input, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resourcesActions } from "../../../../../store/store";
const { updateAccount, addAccount } = resourcesActions;

const ResponseTeamForm = ({ form, type, selectedAccount, departmentList }) => {
  const [changePassword, setChangePassword] = useState(false);
  const deptType = Form.useWatch("deptType", form);
  const { Option } = Select;
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const onFinishHandler = (e) => {
    if (type === "add") {
      const body = {
        ...e,
      };
      dispatch(
        addAccount({
          listType: "responseTeamsList",
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
          listType: "responseTeamsList",
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
        deptType: +selectedAccount.deptType,
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
            name="type"
            label="Type"
            rules={[
              {
                required: true,
                message: "Input response team type",
              },
            ]}
          >
            <Input placeholder="Input response team type" />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[
              {
                required: true,
                message: "Please input first name",
              },
            ]}
          >
            <Input placeholder="Please input first name" />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[
              {
                required: true,
                message: "Please input first name",
              },
            ]}
          >
            <Input placeholder="Please input first name" />
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
        <Col span={24}>
          <Form.Item
            name="plateNumber"
            label="Plate Number"
            rules={[
              {
                required: true,
                message: "Please input plate number",
              },
            ]}
          >
            <Input placeholder="Please input plate number" />
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

export default ResponseTeamForm;
