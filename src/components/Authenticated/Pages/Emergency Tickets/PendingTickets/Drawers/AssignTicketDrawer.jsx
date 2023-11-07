import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";
import { Checkbox, Col, Drawer, Form, Input, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UseFirebaseDB from "../../../../../../Hooks/use-firebasedb";
import {
  resourcesActions,
  ticketsActions,
} from "../../../../../../store/store";
import Button from "../../../../../UI/Button/Button";
const { assignToDepartment } = ticketsActions;
const { fetchResources, updateResources } = resourcesActions;

const AssignTicketDrawer = ({ assigning, setAssigning, selectedTicket }) => {
  const [rtLocations] = UseFirebaseDB("/location");
  const resources = useSelector((state) => state.resources);
  const { responseTeamsList, departmentList } = resources;
  const [responseTeams, setResponseTeams] = useState([]);
  const [defaultProps] = useState({
    center: {
      lat: 14.533103851530154,
      lng: 121,
    },
    zoom: 11,
    mapId: "15f9baeb3890ce9f",
    clickableIcons: false,
  });
  const [form] = Form.useForm();
  const involved = Form.useWatch("involved", form);
  const selectedResponseTeams = Form.useWatch("responseTeams", form);
  const dispatch = useDispatch();

  const { assignToDepartmentLoading } = useSelector((state) => state.tickets);
  const submitFormHandler = () => {
    form.submit();
  };
  const onFinishHandler = (e) => {
    dispatch(
      assignToDepartment({
        param: selectedTicket.transactionNumber,
        body: {
          agentNote: e.note,
          selectedDepartments: e.involved.join(";"),
          selectedResponseTeams: e.responseTeams.join(";"),
        },
      })
    );
  };
  useEffect(() => {
    if (assigning) {
      dispatch(
        updateResources({
          toFetch: ["responseTeamsList", "departmentList"],
        })
      );
    }
  }, [assigning, dispatch]);

  useEffect(() => {
    if (involved?.length) {
      form.setFieldsValue({
        responseTeams: (selectedResponseTeams || []).filter((team) =>
          involved.includes(
            responseTeamsList.filter((t) => t.accountId === team)[0]
              .departmentId
          )
        ),
      });
      setResponseTeams(
        responseTeamsList.filter((teams) =>
          Boolean(
            involved.includes(teams.departmentId) &&
              +teams.availability === 1 &&
              +teams.isAssigned === 0 &&
              rtLocations[teams.accountId]?.latitude &&
              rtLocations[teams.accountId]?.longitude &&
              rtLocations[teams.accountId]?.isOnline
          )
        )
      );
    } else setResponseTeams([]);
  }, [
    involved?.length,
    form,
    involved,
    responseTeamsList,
    selectedResponseTeams,
    rtLocations,
  ]);

  useEffect(() => {
    if (assigning)
      dispatch(updateResources({ toFetch: ["responseTeamsList"] }));
    if (!assigning) {
      form.resetFields();
      setResponseTeams([]);
    }
  }, [assigning]);

  const deptName = (acccountId) => {
    const selectedDept = departmentList.filter(
      (d) => d.accountId == acccountId
    )[0];

    return selectedDept.name;
  };

  return (
    <Drawer
      destroyOnClose={true}
      height={"70vh"}
      closable={true}
      onClose={() => {
        setAssigning(false);
      }}
      open={assigning}
      placement="bottom"
      title="Enter notes for this ticket and select involved department/barangay"
      footer={
        <div className="w-full flex flex-row justify-end">
          <Button
            onClick={submitFormHandler}
            type="primary"
            text="Proceed"
            loading={assignToDepartmentLoading}
          />
        </div>
      }
    >
      <div className="w-full h-full flex flex-row gap-4">
        <div className="w-1/2">
          <Form
            requiredMark={"optional"}
            disabled={assignToDepartmentLoading}
            layout="vertical"
            className=""
            form={form}
            onFinish={onFinishHandler}
          >
            <div className="flex flex-row gap-2">
              <div className="w-1/2">
                <Form.Item
                  label={
                    <span className="text-lg font-medium">{"Departments"}</span>
                  }
                  name={"involved"}
                  rules={[
                    {
                      required: true,
                      message:
                        "Please select one or more department/barangay to assign",
                    },
                  ]}
                >
                  <Checkbox.Group className="w-full flex flex-col">
                    {departmentList
                      .filter((d) => d.isDeleted === 0 && d.deptType !== "5")
                      .map((d) => (
                        <Checkbox
                          key={d.acccountId}
                          value={d.accountId}
                          className="ml-0 w-full text-gray-800 break-words"
                        >
                          {d.name}
                        </Checkbox>
                      ))}
                    <div className="border-t-2 py-1">
                      <span className="text-lg font-medium">{"Barangays"}</span>
                    </div>
                    {departmentList
                      .filter((d) => d.isDeleted === 0 && d.deptType === "5")
                      .map((d) => (
                        <Checkbox
                          key={d.acccountId}
                          value={d.accountId}
                          className="ml-0 w-full text-gray-800 break-words"
                        >
                          {d.name}
                        </Checkbox>
                      ))}
                  </Checkbox.Group>
                </Form.Item>
                <Form.Item
                  className="mt-4"
                  label="Notes"
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
              </div>

              <div className="w-1/2">
                <Form.Item
                  label={
                    <span className="text-lg font-medium">
                      {"Available Response Teams"}
                    </span>
                  }
                  name={"responseTeams"}
                >
                  <Checkbox.Group className="w-full flex-col">
                    {responseTeams.map((rt) => (
                      <Checkbox
                        key={rt.acccountId}
                        value={rt.accountId}
                        className="ml-0 w-full text-gray-800 break-words"
                      >
                        {`${rt.firstName} ${rt.lastName} - ${deptName(
                          rt.departmentId
                        )} (${rt.type})`}
                      </Checkbox>
                    ))}
                  </Checkbox.Group>
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>
        <div className="w-1/2">
          <GoogleMap
            mapContainerStyle={{ height: "100%", width: "100%" }}
            options={defaultProps}
          >
            {selectedTicket && (
              <Marker
                icon={{
                  url: selectedTicket.caseTypeIcon
                    ? `${import.meta.env.VITE_BASE_URL}/${
                        selectedTicket.caseTypeIcon
                      }`
                    : undefined,
                  scaledSize: { height: 40, width: 40 },
                }}
                position={{
                  lat: +selectedTicket.latitude,
                  lng: +selectedTicket.longitude,
                }}
              >
                <InfoWindow
                  options={{
                    pixelOffset: new window.google.maps.Size(0, -38),
                  }}
                  position={{
                    lat: +selectedTicket.latitude,
                    lng: +selectedTicket.longitude,
                  }}
                >
                  <div>
                    <h1 className="font-medium">Emergency Location</h1>
                  </div>
                </InfoWindow>
              </Marker>
            )}
            {responseTeams.length > 0 &&
              responseTeams.map((team) => {
                return (
                  <Marker
                    key={team.accountId}
                    animation={
                      (selectedResponseTeams || []).includes(team.accountId)
                        ? 1
                        : null
                    }
                    onClick={() => {
                      if (
                        (selectedResponseTeams || []).includes(team.accountId)
                      )
                        form.setFieldsValue({
                          responseTeams: (selectedResponseTeams || []).filter(
                            (id) => +id !== +team.accountId
                          ),
                        });
                      else
                        form.setFieldsValue({
                          responseTeams: [
                            ...(selectedResponseTeams || []),
                            team.accountId,
                          ],
                        });
                    }}
                    position={{
                      lat: rtLocations[team.accountId]?.latitude,
                      lng: rtLocations[team.accountId]?.longitude,
                    }}
                  >
                    <InfoWindow
                      options={{
                        pixelOffset: new window.google.maps.Size(0, -38),
                      }}
                      position={{
                        lat: rtLocations[team.accountId]?.latitude,
                        lng: rtLocations[team.accountId]?.longitude,
                      }}
                    >
                      <span className="font-medium">{`${team.firstName} ${team.lastName}`}</span>
                    </InfoWindow>
                  </Marker>
                );
              })}
          </GoogleMap>
        </div>
      </div>
    </Drawer>
  );
};

export default AssignTicketDrawer;
