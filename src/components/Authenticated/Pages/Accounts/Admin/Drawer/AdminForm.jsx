import { Checkbox, Col, Drawer, Form, Input, Row, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import {
  createAdminAccount,
  getCommandCenters,
  updateAdminAccounts,
} from "../../../../../../store/api/adminFn-api";
import Button from "../../../../../UI/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { resourcesActions } from "../../../../../../store/store";

const { setCommandCenters } = resourcesActions;

const AdminForm = ({ mode, onClose, reloadTable, admins }) => {
  const dispatch = useDispatch();
  const [changePassword, setChangePassword] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { commandCenters } = useSelector((state) => state.resources);
  const [fetchLoading, setFetchLoading] = useState(false);

  const fetchCommandCenters = async () => {
    setFetchLoading(true);
    const request = await getCommandCenters();

    if (!request || request.name === "AxiosError") {
      message.error(request?.response.data.message);
    } else {
      dispatch(setCommandCenters(request.data));
    }
    setFetchLoading(false);
  };

  useEffect(() => {
    if (commandCenters.length === 0) fetchCommandCenters();
  }, [commandCenters.length]);

  const onFinishHandler = async (e) => {
    setLoading(true);

    let request;
    if (mode === "adding") request = await createAdminAccount({ body: e });
    else {
      if (changePassword) e.password = "Defensys2023";
      delete e.email;
      request = await updateAdminAccounts({
        body: e,
        param: mode.accountId,
      });
    }
    if (request.name === "AxiosError") {
      message.error(request.response.data.message);
    } else {
      reloadTable();
      message.success(request.data.message);
      onClose();
    }

    setLoading(false);
  };

  useEffect(() => {
    if (mode && mode != "adding") {
      form.setFieldsValue(mode);
    } else {
      setChangePassword(false);
      form.resetFields();
    }
  }, [mode]);

  return (
    <Drawer
      placement="right"
      title={
        mode !== "adding" ? "Edit Admin Information" : "Create a Admin Account"
      }
      onClose={onClose}
      open={!!mode}
      width={"400px"}
      footer={
        <div className="w-full flex flex-row justify-end">
          <Button
            loading={loading}
            text={
              mode !== "adding"
                ? "Update Admin Information"
                : "Create Admin Account"
            }
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
              name="commandCenterId"
              label="Command Center Instance"
              rules={[
                {
                  required: true,
                  message: "Please select an instance",
                },
              ]}
            >
              <Select
                disabled={mode !== "adding"}
                loading={fetchLoading}
                placeholder="Please select an instance"
              >
                {commandCenters.map((cc) => (
                  <Select.Option
                    disabled={admins
                      .map((ad) => ad.commandCenterId)
                      .includes(cc.commandCenterId)}
                    value={cc.commandCenterId}
                    key={cc.commandCenterId}
                  >
                    {cc.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
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
                readOnly={mode !== "adding"}
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

          {mode !== "adding" && (
            <>
              <Col span={24}>
                <Checkbox
                  checked={changePassword}
                  onChange={() => setChangePassword(!changePassword)}
                >
                  Reset password?
                </Checkbox>
              </Col>
            </>
          )}
        </Row>
      </Form>
    </Drawer>
  );
};

export default AdminForm;
