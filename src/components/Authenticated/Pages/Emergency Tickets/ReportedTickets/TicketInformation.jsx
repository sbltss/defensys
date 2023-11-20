import { Descriptions, Image, Tag } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getReportCategory } from "../../../../../helpers";
import { getBlockHistory } from "../../../../../store/api/citizen-api";
// import { getUpdates } from "../../../../../store/api/ticket-api";
import Updates from "../../../Reusable/Updates/Updates";
const { Item } = Descriptions;

const TicketInformation = ({ reportData }) => {
  const {
    transactionNumber,
    caseTypeDesc,
    // status,
    dateCreated,
    firstName,
    lastName,
    departmentName,
    departmentType,
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
  } = reportData || {};
  const { currentUser } = useSelector((state) => state.auth);
  const { reportCategory: reportCategories } = useSelector(
    (state) => state.resources
  );
  const [blockHistory, setBlockHistory] = useState(null);
  useEffect(() => {
    const fetchBlockHistory = async (accountId) => {
      const response = await getBlockHistory({ param: accountId });
      setBlockHistory(response.data);
    };
    if (reportData?.callerId) {
      fetchBlockHistory(reportData.callerId);
    } else setBlockHistory(null);
  }, [reportData?.callerId]);
  return (
    <Descriptions bordered size={"small"} column={1}>
      <Item label="Reference Number">{transactionNumber}</Item>
      <Item label="Case Type">{caseTypeDesc || "Pending Information"}</Item>
      <Item label="Method of Report">
        {getReportCategory(
          reportCategory,
          reportCategoryDesc,
          reportCategories
        )}
      </Item>
      <Item label="Constituent Name">
      <div className="flex flex-col">
          <span>{`${firstName} ${lastName}`}</span>
          {departmentName || departmentType ? (
            <div>
              <Tag color="red" className="mx-0">
                {departmentType} - {departmentName}
              </Tag>
            </div>
          ) : null}
        </div>
      </Item>
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
      {agentNote && <Item label="Note From Dispatcher">{agentNote}</Item>}
      <Item label="Report Category">
        {getReportCategory(
          reportCategory,
          reportCategoryDesc,
          reportCategories
        )}
      </Item>
      {blockHistory?.length > 0 && (
        <Item label="Citizen Block History">
          <div className="flex flex-col">
            {blockHistory.map((h) => (
              <div className="flex flex-col" key={h.id}>
                <span className="text-xs text-gray-500">
                  {moment(h.dateCreated).format("lll")}
                </span>

                <span>
                  <span className="text-sm font-medium text-gray-700">{`${h.firstName} ${h.lastName} (${h.blockType}): `}</span>
                  <span>{`${h.reason}`}</span>
                </span>
                {h.remarks && (
                  <div className="flex flex-row gap-1">
                    <span className="text-sm font-medium text-gray-700">
                      Unblock Remarks:
                    </span>
                    <span>{h.remarks}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Item>
      )}
      {imageUrl && (
        <Item label="Image">
          <Image
            crossOrigin="anonymous"
            width={150}
            height={150}
            className="object-cover"
            src={import.meta.env.VITE_BASE_URL + "/" + imageUrl}
          />
        </Item>
      )}
    </Descriptions>
  );
};

export default TicketInformation;
