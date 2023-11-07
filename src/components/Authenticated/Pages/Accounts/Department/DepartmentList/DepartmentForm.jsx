import React, { useEffect } from "react";
import { Form, Col, Row, Input, Select, Checkbox, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { resourcesActions } from "../../../../../../store/store";
import { barangayList } from "../../../../../../Constants/Index";
import { useState } from "react";
import {
  getBarangays,
  getVolunteerGroups,
} from "../../../../../../store/api/resources-api";
const { updateAccount, addAccount } = resourcesActions;

const DepartmentForm = ({
  form,
  type,
  selectedAccount,
  deptTypeList,
  existingDepts,
}) => {
  const { currentUser } = useSelector((state) => state.auth);
  const [barangays, setBarangays] = useState([]);
  const [volunteerGroups, setVolunteerGroups] = useState([]);
  const [fetchBarangayLoading, setFetchBarangayLoading] = useState(false);
  const [fetchVolunteersLoading, setFetchVolunteersLoading] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const deptType = Form.useWatch("deptType", form);
  const { Option } = Select;
  const dispatch = useDispatch();
  const onFinishHandler = (e) => {
    if (type === "add") {
      const body = {
        ...e,
      };
      dispatch(
        addAccount({
          listType: "departmentList",
          body: body,
        })
      );
    } else {
      const body = {
        ...e,
      };
      delete body.accountId;
      delete body.password;
      if (changePassword) body.password = "Defensys2023";
      dispatch(
        updateAccount({
          listType: "departmentList",
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

  const fetchBarangays = async () => {
    setFetchBarangayLoading(true);
    const request = await getBarangays();

    if (!request || request.name === "AxiosError") {
      message.error(request?.response.data.message);
    } else {
      setBarangays(request.data);
    }
    setFetchBarangayLoading(false);
  };

  const fetchVolunteerGroups = async () => {
    setFetchVolunteersLoading(true);
    const request = await getVolunteerGroups();

    if (!request || request.name === "AxiosError") {
      message.error(request?.response.data.message);
    } else {
      setVolunteerGroups(request.data);
    }
    setFetchVolunteersLoading(false);
  };

  useEffect(() => {
    fetchBarangays();
    fetchVolunteerGroups();
  }, []);
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
            name="deptType"
            label="Department Type"
            rules={[
              {
                required: true,
                message: "Select department type",
              },
            ]}
          >
            <Select placeholder="Select department type">
              {(deptTypeList || [])
                .filter((dept) => {
                  if (
                    (currentUser.isDefault
                      ? ["VOLUNTEERS", "BRGY"]
                      : ["BRGY"]
                    ).includes(dept.typeName) ||
                    selectedAccount?.deptType == dept.id
                  )
                    return true;
                  return !(existingDepts || [])
                    .map((d) => +d.deptType)
                    .includes(+dept.id);
                })
                .map((type) => (
                  <Option value={type.id} key={type.id}>
                    {type.typeName}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </Col>
        {deptType === 5 && (
          <Col span={24}>
            <Form.Item
              name="barangay"
              label="Barangay"
              rules={[
                {
                  required: true,
                  message: "Select Barangay",
                },
              ]}
            >
              <Select placeholder="Select barangay">
                {barangays
                  .filter(
                    (brgy) =>
                      !(existingDepts || [])
                        .map((d) => d.barangay)
                        .includes(brgy.brgyCode)
                  )
                  .map((brgy) => (
                    <Option value={brgy.brgyCode} key={brgy.brgyCode}>
                      {brgy.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
        )}
        {[27, 28].includes(deptType) && (
          <Col span={24}>
            <Form.Item
              name="volunteerId"
              label="Volunteer Group"
              rules={[
                {
                  required: true,
                  message: "Select Volunteer Group",
                },
              ]}
            >
              <Select placeholder="Select volunteer">
                {volunteerGroups

                  .filter(
                    (vol) =>
                      !(existingDepts || [])
                        .map((d) => d.volunteerId)
                        .includes(vol.volunteerId)
                  )
                  .map((volunteer) => (
                    <Option
                      value={volunteer.volunteerId}
                      key={volunteer.volunteerId}
                    >
                      {volunteer.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
        )}

        <Col span={24}>
          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: "Please enter department name",
              },
            ]}
          >
            <Input placeholder="Please enter department name" />
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

export default DepartmentForm;
