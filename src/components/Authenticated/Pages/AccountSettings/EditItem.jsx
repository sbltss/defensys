import { DatePicker, Form, Input } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import Button from "../../../UI/Button/Button";

const EditItem = ({ type, setIsEditing }) => {
  const [form] = Form.useForm();
  const { currentUser } = useSelector((state) => state.auth);
  const {
    firstName,
    middleName,
    lastName,
    birthdate,
    mobileNumber,
    email,
    username,
  } = currentUser;
  return (
    <div className="flex flex-col">
      <Form
        form={form}
        requiredMark="optional"
        layout="vertical"
        className="flex flex-row gap-4 flex-wrap"
        initialValues={
          type === "Name"
            ? {
                firstName,
                middleName,
                lastName,
              }
            : type === "Birthdate"
            ? { birthdate: dayjs(birthdate) }
            : type === "Mobile Number"
            ? { mobileNumber: mobileNumber.substring(2) }
            : type === "Email"
            ? { email }
            : type === "Username"
            ? { username }
            : {}
        }
      >
        {type === "Name" && (
          <>
            <Form.Item
              className="mb-2"
              label="First Name"
              name={"firstName"}
              rules={[
                {
                  required: true,
                  message: "Please enter first name",
                },
              ]}
            >
              <Input allowClear placeholder="Please enter first name" />
            </Form.Item>
            <Form.Item className="mb-2" label="Middle Name" name={"middleName"}>
              <Input allowClear placeholder="Please enter middle name" />
            </Form.Item>
            <Form.Item
              className="mb-2"
              label="Last Name"
              name={"lastName"}
              rules={[
                {
                  required: true,
                  message: "Please enter last name",
                },
              ]}
            >
              <Input allowClear placeholder="Please enter last name" />
            </Form.Item>
          </>
        )}
        {type === "Birthdate" && (
          <>
            <Form.Item
              className="mb-2"
              label={"Birthdate"}
              name={"birthdate"}
              rules={[
                {
                  required: true,
                  message: "Please enter birthdate",
                },
              ]}
            >
              <DatePicker format={"MMMM DD, YYYY"} />
            </Form.Item>
          </>
        )}
        {type === "Mobile Number" && (
          <>
            <Form.Item
              className="mb-2"
              label={"Mobile Number"}
              name={"mobileNumber"}
              rules={[
                {
                  required: true,
                  message: "Please enter phone number",
                },
                {
                  pattern: new RegExp(/^[0-9]+$/),
                  message: "Please enter valid mobile number",
                },
                {
                  min: 10,
                  message: "Mobile number must be at least 10 characters",
                },
              ]}
            >
              <Input
                addonBefore="+63"
                placeholder="Please enter phone number"
                maxLength={10}
              />
            </Form.Item>
          </>
        )}
        {type === "Email" && (
          <>
            <Form.Item
              className="mb-2"
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please enter your email address",
                },
                {
                  type: "email",
                  message: "The input is not a valid email",
                },
              ]}
            >
              <Input placeholder="Please enter email" />
            </Form.Item>
          </>
        )}
        {type === "Username" && (
          <>
            <Form.Item
              className="mb-2"
              label="Username"
              name="username"
              rules={[
                {
                  min: 5,
                  message: "Please enter with atleast 5 characters",
                },
                {
                  required: true,
                  message: "Please enter username",
                },
              ]}
            >
              <Input allowClear placeholder="Please enter username" />
            </Form.Item>
          </>
        )}
      </Form>
      <div className="flex flex-row gap-1">
        <Button
          text="Cancel"
          type="muted"
          onClick={() => setIsEditing(false)}
        />
        <Button text="Save" type="primary" onClick={() => form.submit()} />
      </div>
    </div>
  );
};

export default EditItem;
