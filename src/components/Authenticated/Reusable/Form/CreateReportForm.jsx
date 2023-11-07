import { Checkbox, Col, Form, Input, Radio, Row, Select } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { callActions, resourcesActions } from "../../../../store/store";
import { useState } from "react";
import UseFirebaseDB from "../../../../Hooks/use-firebasedb";
const { createTicketFromCall } = callActions;
const { fetchResources, updateResources } = resourcesActions;

const CreateReportForm = ({
  form,
  locationName,
  callerId,
  coordinates,
  rtCallerId,
}) => {
  const [rtLocations] = UseFirebaseDB("/location");
  const involved = Form.useWatch("involved", form);
  const [responseTeams, setResponseTeams] = useState([]);
  const dispatch = useDispatch();
  const resources = useSelector((state) => state.resources);
  const { createTicketFromCallLoading } = useSelector((state) => state.call);
  const { caseTypes, departmentList, responseTeamsList } = resources;

  useEffect(() => {
    if (responseTeamsList.length > 0) {
      setResponseTeams(
        responseTeamsList.filter((teams) => {
          return Boolean(
            involved?.includes(teams.departmentId) &&
              +teams.availability === 1 &&
              +teams.isAssigned === 0 &&
              rtLocations[teams.accountId]?.latitude &&
              rtLocations[teams.accountId]?.longitude &&
              rtLocations[teams.accountId]?.isOnline
          );
        })
      );
    }
  }, [involved, responseTeamsList, rtLocations]);

  useEffect(() => {
    if (callerId) dispatch(updateResources({ toFetch: ["responseTeamsList"] }));
  }, [callerId]);
  useEffect(() => {
    dispatch(
      fetchResources({
        existing: resources,
        toFetch: ["departmentList", "caseTypes", "responseTeamsList"],
      })
    );
  }, [dispatch]);
  const onFinishHandler = (values) => {
    const { caseType, content, withInjury, involved, note } = values;
    const body = {
      caseType,
      address: locationName,
      latitude: coordinates?.lat,
      longitude: coordinates?.lng,
      content,
      withInjury,
      callerId: callerId || rtCallerId,
      involved: involved.join(";"),
      note,
      responseTeams: (values.responseTeams || []).join(";"),
      isRT: rtCallerId ? 1 : 0,
    };
    dispatch(createTicketFromCall(body));
  };

  const deptName = (acccountId) => {
    const selectedDept = departmentList.filter(
      (d) => d.accountId == acccountId
    )[0];

    return selectedDept.name;
  };

  return (
    <Form
      disabled={createTicketFromCallLoading}
      requiredMark="optional"
      form={form}
      onFinish={onFinishHandler}
      labelCol={{
        span: 5,
      }}
      wrapperCol={{
        span: 24,
      }}
      labelAlign="left"
    >
      <Form.Item
        label="Emergency Type"
        name="caseType"
        rules={[{ required: true, message: "Please Select Emergency Type" }]}
      >
        <Select placeholder="Select Emergency Type">
          {caseTypes
            .filter((type) => !type.isDeleted)
            .map((ct) => (
              <Select.Option key={ct.id} value={ct.id}>
                {ct.typeName}
              </Select.Option>
            ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="With Injury"
        name="withInjury"
        rules={[{ required: true, message: "Please Select One" }]}
      >
        <Radio.Group
          options={[
            { label: "Yes", value: 1 },
            { label: "No", value: 0 },
          ]}
        />
      </Form.Item>
      <Form.Item
        label="Brief Description"
        name="content"
        rules={[
          { required: true, message: "Please Input Emergency Description" },
        ]}
      >
        <Input.TextArea rows={5} />
      </Form.Item>

      <Form.Item
        className="mt-4"
        label="Dispatcher Note"
        name={"note"}
        // rules={[
        //   {
        //     required: true,
        //     message:
        //       "Please provide notes or additional informamtion for the ticket",
        //   },
        // ]}
      >
        <Input.TextArea
          row="4"
          placeholder="Please input notes or additional information for the ticket"
        />
      </Form.Item>
      <Form.Item
        label="Departments"
        name={"involved"}
        rules={[
          {
            required: true,
            message: "Please select one or more department/barangay to assign",
          },
        ]}
      >
        <Checkbox.Group className="w-full flex flex-col">
          {departmentList
            .filter((d) => d.isDeleted === 0 && d.deptType !== "5")
            .map((d) => {
              return (
                <Col span={12} key={d.accountId} className="mb-2 w-full">
                  <Checkbox
                    key={d.acccountId}
                    value={d.accountId}
                    className="ml-0 w-full text-gray-800 break-words"
                  >
                    {d.name}
                  </Checkbox>
                </Col>
              );
            })}
          <div className="border-t-2 py-1">
            <span className="text-lg font-medium">{"Barangays"}</span>
          </div>
          {departmentList
            .filter((d) => d.isDeleted === 0 && d.deptType === "5")
            .map((d) => {
              return (
                <Checkbox
                  key={d.acccountId}
                  value={d.accountId}
                  className="ml-0 w-full text-gray-800 break-words"
                >
                  {d.name}
                </Checkbox>
              );
            })}
        </Checkbox.Group>
      </Form.Item>
      <Form.Item label="Response Teams" name={"responseTeams"}>
        <Checkbox.Group className="w-full flex flex-col">
          {responseTeams.map((d) => {
            return (
              <Checkbox
                key={d.acccountId}
                value={d.accountId}
                className="ml-0 w-full text-gray-800 break-words"
              >
                {`${d.firstName} ${d.lastName} - ${deptName(d.departmentId)} (${
                  d.type
                })`}
              </Checkbox>
            );
          })}
        </Checkbox.Group>
      </Form.Item>
    </Form>
  );
};

export default CreateReportForm;
