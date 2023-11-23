import { Badge, Collapse, Descriptions, Tag } from "antd";
import moment from "moment";
import React from "react";
import { useSelector } from "react-redux";
import Updates from "../../../../../Reusable/Updates/Updates";
import ResponseTeams from "./ResponseTeams/ResponseTeams";
const { Item } = Descriptions;
const { Panel } = Collapse;

const Department = ({ department }) => {
  const {
    name,
    status,
    typeName,
    contactNumber,
    remarks,
    dtAccepted,
    dtDeclined,
    dtResolved,
    allocatedTo,
    personsInvolved,
    isVolunteer,
  } = department;
  const { selectedAcceptedTicket } = useSelector((state) => state.tickets);
  const { currentUser } = useSelector((state) => state.auth);

  return (
    <Collapse ghost defaultActiveKey={[0]} className="w-[500px]">
      <Panel
        header={
          <div className="flex flex-row justify-between">
            {isVolunteer ? (
              <div className="flex flex-row justify-start items-center gap-2">
                <span>{name}</span>
                <Tag color="yellow">Volunteer Group</Tag>
              </div>
            ) : (
              <span>{name}</span>
            )}
            {status === 0 && <Badge status="default" text="Pending" />}
            {status === 1 && <Badge status="processing" text="Accepted" />}
            {status === 2 && <Badge status="danger" text="Declined" />}
            {status === 3 && <Badge status="success" text="Reported" />}
          </div>
        }
      >
        <div className="rounded-md">
          <Descriptions layout="vertical" bordered size={"small"} column={2}>
            <Item label="Department Type" span={2}>
              {typeName}
            </Item>
            <Item label="Contact Number" span={2}>
              {contactNumber}
            </Item>
            <Item label="Time Log" span={2}>
              <div className="flex flex-col">
                {dtAccepted && (
                  <div className="flex flex-row justify-between">
                    <span>Accepted</span>
                    <span>{moment(dtAccepted).format("lll")}</span>
                  </div>
                )}
                {dtDeclined && (
                  <div className="flex flex-row justify-between">
                    <span>Declined</span>
                    <span>{moment(dtDeclined).format("lll")}</span>
                  </div>
                )}
                {dtResolved && (
                  <div className="flex flex-row justify-between">
                    <span>Resolved</span>

                    <span>{moment(dtResolved).format("lll")}</span>
                  </div>
                )}
              </div>
            </Item>
            <Item
              label={
                <div className="flex flex-row justify-between items-center">
                  <span>Updates</span>
                </div>
              }
              className="flex flex-col"
              span={2}
            >
              {selectedAcceptedTicket?.transactionNumber && (
                <Updates
                  type="department"
                  accountId={allocatedTo}
                  transactionNumber={selectedAcceptedTicket?.transactionNumber}
                />
              )}
            </Item>
            {personsInvolved && (
              <Item label="Persons Involved">
                <ul>
                  {personsInvolved.split(";").map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              </Item>
            )}
            {!!remarks && (
              <Item label="Remarks" span={2}>
                {remarks}
              </Item>
            )}
            <Item label="Response Teams" span={2}>
              <ResponseTeams
                department={department}
                transactionNumber={department.transactionNumber}
              />
            </Item>
          </Descriptions>
        </div>
      </Panel>
    </Collapse>
  );
};

export default Department;
