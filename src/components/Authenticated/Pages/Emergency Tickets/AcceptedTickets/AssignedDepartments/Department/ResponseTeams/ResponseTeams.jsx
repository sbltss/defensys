import { Badge, Collapse, Descriptions, Image } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAssignedResponseTeams } from "../../../../../../../../store/api/ticket-api";
import { ticketsActions } from "../../../../../../../../store/store";
const { addToResponseTeams } = ticketsActions;

const { Panel } = Collapse;
const { Item } = Descriptions;

const ResponseTeams = ({ department, transactionNumber }) => {
  const dispatch = useDispatch();
  const { socket } = useSelector((state) => state.auth);
  const [assignedResponseTeams, setAssignedResponseTeams] = useState([]);
  useEffect(() => {
    if (socket) {
      socket.on("dept_assign_update", async (data) => {
        if (data.transactionNumber === transactionNumber) {
          const result = await getAssignedResponseTeams({
            param: transactionNumber,
            body: { departmentId: department.allocatedTo },
          });
          dispatch(addToResponseTeams(result.data.responseTeams));
          setAssignedResponseTeams(result.data.responseTeams);
        }
      });
      socket.on("responder_assign_update", async (data) => {
        if (data.transactionNumber === transactionNumber) {
          const result = await getAssignedResponseTeams({
            param: transactionNumber,
            body: { departmentId: department.allocatedTo },
          });
          dispatch(addToResponseTeams(result.data.responseTeams));
          setAssignedResponseTeams(result.data.responseTeams);
        }
      });
    }
    return () => {
      if (socket) {
        socket.off("dept_assign_update");
        socket.off("responder_assign_update");
      }
    };
  }, [socket, transactionNumber]);
  useEffect(() => {
    const fetchAssignedResponseTeams = async (transactionNumber) => {
      const result = await getAssignedResponseTeams({
        param: transactionNumber,
        body: { departmentId: department.allocatedTo },
      });
      dispatch(addToResponseTeams(result.data.responseTeams));
      setAssignedResponseTeams(result.data.responseTeams);
    };
    if (transactionNumber && department.allocatedTo)
      fetchAssignedResponseTeams(transactionNumber);
  }, [department.allocatedTo, transactionNumber]);

  if (!assignedResponseTeams) {
    return <span>Loading response teams...</span>;
  }
  if (assignedResponseTeams?.length === 0) {
    return <span>No response team assigned</span>;
  }

  return (
    <Collapse defaultActiveKey={[0]}>
      {assignedResponseTeams.map((rt) => (
        <Panel
          key={rt.accountId}
          header={
            <div className="flex flex-row justify-between">
              <span>{rt.rtName}</span>
              {rt.status === 0 && <Badge status="default" text="Pending" />}
              {rt.status === 1 && <Badge status="error" text="Declined" />}
              {rt.status === 2 && <Badge status="processing" text="Accepted" />}
              {rt.status === 3 && <Badge status="processing" text="Arrived" />}
              {rt.status === 4 && <Badge status="success" text="Reported" />}
              {rt.status === -1 && <Badge status="error" text="Cancelled" />}
            </div>
          }
        >
          <Descriptions layout="vertical" bordered size={"small"} column={2}>
            <Item label="Contact number" span={2}>
              {rt.contactNumber}
            </Item>
            <Item label="Time Log" span={2}>
              <div className="flex flex-col">
                {rt.dtAccepted && (
                  <div className="flex flex-row justify-between">
                    <span>Accepted</span>
                    <span>{moment(rt.dtAccepted).format("lll")}</span>
                  </div>
                )}
                {rt.dtArrived && (
                  <div className="flex flex-row justify-between">
                    <span>Arrived</span>
                    <span>{moment(rt.dtArrived).format("lll")}</span>
                  </div>
                )}
                {rt.dtCancelled && (
                  <div className="flex flex-row justify-between">
                    <span>Cancelled</span>

                    <span>{moment(rt.dtCancelled).format("lll")}</span>
                  </div>
                )}
                {rt.dtDeclined && (
                  <div className="flex flex-row justify-between">
                    <span>Declined</span>
                    <span>{moment(rt.dtDeclined).format("lll")}</span>
                  </div>
                )}
                {rt.dtResolved && (
                  <div className="flex flex-row justify-between">
                    <span>Resolved</span>

                    <span>{moment(rt.dtResolved).format("lll")}</span>
                  </div>
                )}
              </div>
            </Item>

            {rt.remarks && (
              <Item label="Remarks" span={2}>
                {rt.remarks}
              </Item>
            )}
            {rt.imgUrl && (
              <Item label="Reported Image" span={2}>
                {rt.imgUrl.split(";;;").map((img) => {
                  return (
                    <Image
                      key={img}
                      src={import.meta.env.VITE_BASE_URL + "/" + img}
                      alt="Image"
                      width={150}
                      height={150}
                      className="object-cover"
                    />
                  );
                })}
              </Item>
            )}
          </Descriptions>
        </Panel>
      ))}
    </Collapse>
  );
};

export default ResponseTeams;

//getAssignedResponseTeams
