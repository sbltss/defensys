import { Descriptions, Image, Space } from "antd";
import moment from "moment";
import React from "react";
import { useSelector } from "react-redux";
import { getReportCategory } from "../../../../../helpers";
import Updates from "../../../Reusable/Updates/Updates";
const { Item } = Descriptions;

const TicketInformation = ({ reportData }) => {
  const {
    transactionNumber,
    typeName,
    // status,
    dateCreated,
    firstName,
    lastName,
    callerId,
    mobileNumber,
    imageUrl,
    address,
    longitude,
    latitude,
    // baseURL,
    dtAssigned,
    dtReported,
    agentNote,
    reportCategory,
    reportCategoryDesc,
    content,
    agentId,
  } = reportData || {};
  const { reportCategory: reportCategories, agentList } = useSelector(
    (state) => state.resources
  );
  const getAgent = (agentId) => {
    const selectedAgent = agentList.filter((ag) => ag.accountId === agentId)[0];
    return [selectedAgent.firstName, selectedAgent.lastName].join(" ");
  };
  const { currentUser } = useSelector((state) => state.auth);
  return (
    <>
      <Descriptions bordered size={"small"} column={1}>
        <Item label="Reference Number">{transactionNumber}</Item>
        <Item label="Case Type">{typeName || "Pending Information"}</Item>
        <Item label="Method of Report">
          {getReportCategory(
            reportCategory,
            reportCategoryDesc,
            reportCategories
          )}
        </Item>
        {/* <Item label="Constituent Name">{`${firstName} ${lastName}`}</Item> */}
        <Item label="Constituent ID">{callerId}</Item>
        <Item label="Mobile Number">{mobileNumber}</Item>
        {/* <Item label="Current Status">
        {status === "0"
          ? "Pending"
          : status === "1"
          ? "Ongoing"
          : status === "2"
          ? "Resolved"
          : status === "3"
          ? "Closed"
          : "Cancelled"}
      </Item> */}
        <Item label="Content">{content}</Item>
        <Item label="Address">{address}</Item>
        {latitude && longitude && (
          <Item label="Coordinates">
            <div className="flex flex-row justify-between">
              <div className="flex flex-col">
                <span>{`Latitude:${(+latitude).toFixed(4)}`}</span>
                <span>{`Longitude:${(+longitude).toFixed(4)}`}</span>
              </div>
              <div>
                <a
                  className="text-blue-500"
                  href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View in Google Maps
                </a>
              </div>
            </div>
          </Item>
        )}
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
        <Item label="Dispatcher-in-Charge">{agentId && getAgent(agentId)}</Item>
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
