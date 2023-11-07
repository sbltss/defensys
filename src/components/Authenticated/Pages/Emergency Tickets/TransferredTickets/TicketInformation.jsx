import { Descriptions, Image, Tag } from "antd";
import moment from "moment";
import React from "react";
import { useSelector } from "react-redux";
import { getReportCategory } from "../../../../../helpers";
import Updates from "../../../Reusable/Updates/Updates";
const { Item } = Descriptions;

const TicketInformation = ({ reportData }) => {
  const { currentUser } = useSelector((state) => state.auth);
  const {
    transactionNumber,
    caseTypeDesc,
    status,
    dateCreated,
    firstName,
    lastName,
    callerId,
    mobileNumber,
    imageUrl,
    address,
    dtAssigned,
    dtReported,
    agentNote,
    reportCategory,
    reportCategoryDesc,
    content,
    transferFrom,
    transferTo,
    remarks,
  } = reportData || {};
  const { reportCategory: reportCategories } = useSelector(
    (state) => state.resources
  );
  const resources = useSelector((state) => state.resources);
  const { agentList, supervisorList } = resources;
  const getTransferName = () => {
    if (transferFrom === currentUser.accountId) {
      let selected = agentList.filter((agent) => {
        return agent.accountId === transferTo;
      });
      if (selected.length > 0)
        return `${selected[0]?.firstName} ${selected[0]?.lastName}`;
      let selected2 = supervisorList.filter((agent) => {
        return agent.accountId === transferTo;
      });
      if (selected2.length > 0)
        return `${selected2[0]?.firstName} ${selected2[0]?.lastName} (Supervisor)`;
      return "";
    } else {
      let selected = agentList.filter((agent) => {
        return agent.accountId === transferFrom;
      });
      if (selected.length > 0)
        return `${selected[0]?.firstName} ${selected[0]?.lastName}`;
      let selected2 = supervisorList.filter((agent) => {
        return agent.accountId === transferFrom;
      });
      if (selected2.length > 0)
        return `${selected2[0]?.firstName} ${selected2[0]?.lastName} (Supervisor)`;
      return "";
    }
  };
  return (
    <>
      <Descriptions column={1} bordered size={"small"}>
        <Item label="Transfer Status">
          {status === -1 ? (
            <Tag color="red">Cancelled</Tag>
          ) : +status === 0 ? (
            <Tag color="yellow">Pending</Tag>
          ) : +status === 1 ? (
            <Tag color="red">Declined</Tag>
          ) : +status === 2 ? (
            <Tag color="green">Accepted</Tag>
          ) : null}
        </Item>
        <Item label="Transfer Type">
          {transferFrom === currentUser.accountId ? (
            <Tag color="red">Outgoing</Tag>
          ) : (
            <Tag color="orange">Incoming</Tag>
          )}
        </Item>
        <Item label="Transfer from/to">{getTransferName()}</Item>
        <Item label="Remarks">{remarks}</Item>
      </Descriptions>
      <br />
      <Descriptions column={1} bordered size={"small"}>
        <Item label="Reference Number">{transactionNumber}</Item>
        <Item label="Case Type">{caseTypeDesc || "Pending Information"}</Item>
        <Item label="Method of Report">
          {getReportCategory(
            reportCategory,
            reportCategoryDesc,
            reportCategories
          )}
        </Item>
        <Item label="Constituent Name">{`${firstName} ${lastName}`}</Item>
        <Item label="Constituent ID">
          {callerId}
          {!callerId && (
            <div>
              <Tag color="red" className="mx-0">
                Non-registered
              </Tag>
            </div>
          )}
        </Item>
        <Item label="Mobile Number">{mobileNumber}</Item>
        <Item label="Content">{content}</Item>
        <Item label="Address">{address}</Item>

        <Item label="Date & Time Created">
          {moment(dateCreated).format("LLL")}
        </Item>
        {dtAssigned && (
          <Item label="Date & Time Assigned To Departments">
            {moment(dtAssigned).format("LLL")}
          </Item>
        )}
        {dtReported && (
          <Item label="Date & Time Assigned To Departments">
            {moment(dtReported).format("LLL")}
          </Item>
        )}
        {agentNote && <Item label="Note From Dispatcher">{agentNote}</Item>}

        <Item label="Report Category">
          {getReportCategory(
            reportCategory,
            reportCategoryDesc,
            reportCategories
          )}
        </Item>
        {currentUser.accountType === "department" && (
          <Item label="Dispatcher Updates">
            <Updates accountType={0} transactionNumber={transactionNumber} />
          </Item>
        )}
        <Item
          label={
            <div className="flex flex-row justify-between items-center">
              <span>Updates</span>
            </div>
          }
        >
          <Updates
            type={currentUser.accountType}
            editable={true}
            accountType={currentUser.accountType === "agent" ? 0 : undefined}
            accountId={
              currentUser.accountType === "department"
                ? currentUser.accountId
                : undefined
            }
            transactionNumber={transactionNumber}
          />
        </Item>
        {imageUrl && (
          <Item label="Image">
            <Image
              crossOrigin="same-site"
              width={150}
              height={150}
              className="object-cover"
              src={import.meta.env.VITE_BASE_URL + "/" + imageUrl}
            />
          </Item>
        )}
      </Descriptions>
    </>
  );
};

export default TicketInformation;
