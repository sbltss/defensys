import { PDFDownloadLink } from "@react-pdf/renderer";
import { Descriptions, Drawer, Image, Spin } from "antd";
import moment from "moment";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { getReportCategory } from "../../../../../helpers";
import { useState } from "react";
import { getReportData } from "../../../../../store/api/ticket-api";
import Badge from "../../../../UI/Badge/Badge";
import ReportPdf from "../../Reports/ReportPdf";
import Button from "../../../../UI/Button/Button";
const MarkerDrawer = ({ selectedMarker, setSelectedMarker }) => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { reportCategory: reportCategories } = useSelector(
    (state) => state.resources
  );

  const { currentUser } = useSelector((state) => state.auth);

  const fetchReport = async (transactionNumber) => {
    setLoading(true);
    const result = await getReportData(transactionNumber);
    setReportData(result.data);
    setLoading(false);
  };

  useEffect(() => {
    if (selectedMarker) {
      fetchReport(selectedMarker.transactionNumber);
    } else setReportData(null);
  }, [selectedMarker]);
  return (
    <Drawer
      width={"700px"}
      // title={`${caseTypeDesc || ""} - ${address || ""}`}
      placement="right"
      onClose={() => setSelectedMarker(null)}
      open={!!selectedMarker}
      extra={
        <div className="flex flex-row gap-2 w-full justify-end">
          <PDFDownloadLink
            document={
              <ReportPdf
                reportData={reportData}
                reportCategories={reportCategories}
                currentUser={currentUser}
              />
            }
            fileName={
              reportData ? reportData.transactionNumber : "Emergency Ticket"
            }
          >
            {({ blob, url, loading, error }) => (
              <Button
                type="primary"
                text="Download Report"
                // onClick={downloadHandler}
                loading={loading}
              />
            )}
          </PDFDownloadLink>
        </div>
      }
    >
      {!loading && (
        <div className="flex flex-col gap-2">
          <Descriptions
            title="Emergency Details"
            column={1}
            bordered
            size={"small"}
          >
            {!!reportData &&
              formatTicketInfo(reportData, reportCategories).map((i, idx) => {
                if (!i.value) return null;
                return (
                  <Descriptions.Item key={idx} label={i.label}>
                    {i.value}
                  </Descriptions.Item>
                );
              })}
          </Descriptions>
          <Descriptions
            title="Citizen Details"
            column={1}
            bordered
            size={"small"}
          >
            {!!reportData &&
              formatTicketInfo(reportData, reportCategories, "citizen").map(
                (i, idx) => {
                  if (!i.value) return null;
                  return (
                    <Descriptions.Item key={idx} label={i.label}>
                      {i.value}
                    </Descriptions.Item>
                  );
                }
              )}
          </Descriptions>
          <Descriptions title="Assigned Dispatchers" bordered size={"small"}>
            {!!reportData?.involvedAgent &&
              reportData.involvedAgent.map((agent) => (
                <Descriptions.Item
                  key={agent.accountId}
                  label={`${agent.firstName} ${agent.lastName}`}
                >
                  {agent.remarks}
                </Descriptions.Item>
              ))}
          </Descriptions>
          {!!reportData &&
            reportData.involvedDepartments.map((department) => (
              <Descriptions
                key={department.accountId}
                title={department.name}
                column={1}
                bordered
                size={"small"}
              >
                <Descriptions.Item label={"Department Type"}>
                  {department.deptTypeDesc}
                </Descriptions.Item>
                <Descriptions.Item label={"Contact Number"}>
                  {department.contactNumber}
                </Descriptions.Item>
                <Descriptions.Item label={"Date Time Assigned"}>
                  {moment(department.dateCreated).format("lll")}
                </Descriptions.Item>
                {department.dtAccepted && (
                  <Descriptions.Item label={"Date Time Accepted"}>
                    {moment(department.dtAccepted).format("lll")}
                  </Descriptions.Item>
                )}
                {department.dtDeclined && (
                  <Descriptions.Item label={"Date Time Declined"}>
                    {moment(department.dtDeclined).format("lll")}
                  </Descriptions.Item>
                )}
                {department.dtResolved && (
                  <Descriptions.Item label={"Date Time Resolved"}>
                    {moment(department.dtResolved).format("lll")}
                  </Descriptions.Item>
                )}
                <Descriptions.Item label={"Remarks"} span="3">
                  {department.remarks}
                </Descriptions.Item>

                <Descriptions.Item label={"Response Team(s)"} span="3">
                  {department.responseTeams.map((rt) => (
                    <Descriptions
                      key={rt.accountId}
                      title={`${rt.firstName} ${rt.lastName}`}
                      layout="vertical"
                      bordered
                      size={"small"}
                    >
                      <Descriptions.Item label="Response Team Type">
                        {rt.type}
                      </Descriptions.Item>
                      <Descriptions.Item label="Plate Number">
                        {rt.plateNumber}
                      </Descriptions.Item>
                      <Descriptions.Item label="Contact Number">
                        {rt.contactNumber}
                      </Descriptions.Item>
                      <Descriptions.Item label="Date Time Assigned">
                        {moment(rt.dateCreated).format("lll")}
                      </Descriptions.Item>
                      {rt.dtAccepted && (
                        <Descriptions.Item label="Date Time Accepted">
                          {moment(rt.dtAccepted).format("lll")}
                        </Descriptions.Item>
                      )}
                      {rt.dtArrived && (
                        <Descriptions.Item label="Date Time Arrived">
                          {moment(rt.dtArrived).format("lll")}
                        </Descriptions.Item>
                      )}
                      {rt.dtCancelled && (
                        <Descriptions.Item label="Date Time Cancelled">
                          {moment(rt.dtCancelled).format("lll")}
                        </Descriptions.Item>
                      )}
                      {rt.dtDeclined && (
                        <Descriptions.Item label="Date Time Declined">
                          {moment(rt.dtDeclined).format("lll")}
                        </Descriptions.Item>
                      )}
                      {rt.dtResolved && (
                        <Descriptions.Item label="Date Time Resolved">
                          {moment(rt.dtResolved).format("lll")}
                        </Descriptions.Item>
                      )}
                      <Descriptions.Item label="Remarks">
                        {rt.remarks}
                      </Descriptions.Item>
                      {rt.imgUrl && (
                        <Descriptions.Item label="Images">
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
                        </Descriptions.Item>
                      )}
                    </Descriptions>
                  ))}
                </Descriptions.Item>
              </Descriptions>
            ))}
        </div>
      )}
      {loading && (
        <div className="flex justify-center">
          <Spin tip="Loading Report" size="large" />
        </div>
      )}
    </Drawer>
  );
};
const formatTicketInfo = (ticketInfo, reportCategories, type = "ticket") => {
  const {
    transactionNumber,
    caseTypeDesc,
    status,
    content,
    address,
    latitude,
    longitude,
    dateCreated,
    dtAssigned,
    agentNote,
    reportCategory,
    reportCategoryDesc,
    callerId,
    firstName,
    lastName,
    mobileNumber,
    imageUrl,
  } = ticketInfo;
  if (type === "ticket")
    return [
      {
        label: "Transaction Number",
        value: transactionNumber,
      },
      {
        label: "Case Type",
        value: caseTypeDesc,
      },
      {
        label: "Current Status",
        value: <Badge type="ticketStatus" text={status} />,
      },
      {
        label: "Content",
        value: content,
      },
      {
        label: "Address",
        value: address,
      },
      {
        label: "Coordinates",
        value: `${latitude}, ${longitude}`,
      },
      {
        label: "Date & Time Created",
        value: dateCreated ? moment(dateCreated).format("LLL") : null,
      },
      {
        label: "Date & Time Assigned To Departments",
        value: dtAssigned ? moment(dtAssigned).format("LLL") : null,
      },
      {
        label: "Note From Dispatcher",
        value: agentNote,
      },
      {
        label: "Report Category",
        value: getReportCategory(
          reportCategory,
          reportCategoryDesc,
          reportCategories
        ),
      },
      ...(imageUrl
        ? [
            {
              label: "Image",
              value: (
                <Image
                  width={150}
                  height={150}
                  className="object-cover"
                  alt="image"
                  src={`${import.meta.env.VITE_BASE_URL}/${imageUrl}`}
                />
              ),
            },
          ]
        : []),
    ];
  else if (type === "citizen")
    return [
      {
        label: "Account ID",
        value: callerId,
      },
      { label: "Citizen", value: `${firstName} ${lastName}` },
      {
        label: "Contact Number",
        value: mobileNumber,
      },
    ];
};
export default MarkerDrawer;
