import { PDFDownloadLink } from "@react-pdf/renderer";
import { Image as AntdImage, Descriptions, Drawer, Tag, message } from "antd";
import moment from "moment";
import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { getReportCategory } from "../../../../../helpers";
import Badge from "../../../../UI/Badge/Badge";
import Button from "../../../../UI/Button/Button";
import ReportPdf from "../ReportPdf";
import { useState } from "react";
import { excludeRTReport } from "../../../../../store/api/reports-api";
import ExcludedReports from "./ExcludedReports";

const TicketReport = ({ reportData, selectTicketHandler, reload }) => {
  const { reportCategory: reportCategories } = useSelector(
    (state) => state.resources
  );
  const { currentUser } = useSelector((state) => state.auth);
  const reportRef = useRef();
  const [loading, setLoading] = useState(null);
  const [viewExcluded, setViewExcluded] = useState(false);

  const excludeReportHandler = async (id) => {
    setLoading(id);
    const result = await excludeRTReport({ param: id });
    if (result.name === "AxiosError") {
      message.error(result.response.data.message);
    } else {
      message.success(result.data.message);
      reload();
    }
    setLoading(null);
  };

  return (
    <Drawer
      destroyOnClose
      title={"Ticket Report"}
      height={"90vh"}
      placement="bottom"
      onClose={() => selectTicketHandler(null)}
      open={!!reportData}
      extra={
        <div className="flex flex-row gap-2 w-full justify-end">
          {reportData?.involvedDepartments
            .reduce((acc, val) => [...acc, ...val.responseTeams], [])
            .find((rt) => !rt.isIncluded) && (
            <Button
              type="muted"
              text="View Excluded Reports"
              onClick={() => setViewExcluded(true)}
            />
          )}
          <PDFDownloadLink
            document={
              <ReportPdf
                reportData={reportData}
                reportCategories={reportCategories}
                currentUser={currentUser}
              />
            }
            fileName={
              reportData ? reportData?.transactionNumber : "Emergency Ticket"
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
      {/* {reportData && reportCategories && (
        <div className="h-auto w-full ">
          <PDFViewer width={900} height={900}>
            <ReportPdf
              reportData={reportData}
              reportCategories={reportCategories}
              currentUser={currentUser}
            />
          </PDFViewer>
        </div>
      )} */}
      <ExcludedReports
        reload={reload}
        open={viewExcluded}
        onClose={() => setViewExcluded(false)}
        reports={reportData?.involvedDepartments
          .reduce(
            (acc, val) => [
              ...acc,
              ...val.responseTeams.map((rt) => ({ ...rt, deptName: val.name })),
            ],
            []
          )
          .filter((rt) => !rt.isIncluded)}
      />
      <div className="h-auto w-full flex justify-center items-center">
        <div
          ref={reportRef}
          className="flex p-4 flex-col gap-2 max-w-[900px] w-full "
        >
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
          <Descriptions
            column={1}
            title="Assigned Dispatchers"
            bordered
            size={"small"}
          >
            {!!reportData?.involvedAgent &&
              reportData?.involvedAgent.map((agent) => (
                <Descriptions.Item
                  key={agent.accountId}
                  label={`${agent.firstName} ${agent.lastName}`}
                >
                  {agent.remarks}
                </Descriptions.Item>
              ))}
          </Descriptions>
          {!!reportData &&
            reportData?.involvedDepartments.map((department, idx) =>
              department.responseTeams.filter((rt) => rt.isIncluded).length ===
              0 ? null : (
                <Descriptions
                  className="mb-8"
                  title={
                    <div className="flex flex-row justify-between items-center">
                      <div className="flex flex-row justify-start items-center gap-2">
                        <span>{department.name}</span>
                        {!!department.responseTeams.find(
                          (rt) => rt.isVolunteer
                        ) && <Tag color="yellow">Volunteer Group</Tag>}
                      </div>
                    </div>
                  }
                  key={idx}
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
                  <Descriptions.Item label={"Remarks"}>
                    {department.remarks}
                  </Descriptions.Item>

                  <Descriptions.Item label={"Response Team(s)"}>
                    {department.responseTeams
                      .filter((rt) => rt.isIncluded)
                      .map((rt, idx) => (
                        <Descriptions
                          className="mb-8"
                          title={
                            <div className="flex flex-row justify-between items-center">
                              <div className="flex flex-row justify-start items-center gap-2">
                                <span>{`${rt.firstName} ${rt.lastName}`}</span>
                                {!!rt.isVolunteer && (
                                  <Tag color="yellow">Volunteer Responder</Tag>
                                )}
                              </div>
                              {!!rt.isVolunteer && (
                                <Button
                                  loading={loading === rt.id}
                                  type={"muted"}
                                  text="Exclude"
                                  onClick={() => excludeReportHandler(rt.id)}
                                />
                              )}
                            </div>
                          }
                          column={1}
                          bordered
                          size={"small"}
                          key={idx}
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
                          {(rt.dtResolved && rt.dtAccepted) &&  (
                            <Descriptions.Item label="Resolution Time">
                              {moment.duration(moment(rt.dtResolved).diff(moment(rt.dtAccepted), 'HH:mm:ss')).days()} day(s)&nbsp;
                              {Math.floor(moment.duration(moment(rt.dtResolved).diff(moment(rt.dtAccepted), 'HH:mm:ss')).asHours())} hour(s)&nbsp;
                              {moment.duration(moment(rt.dtResolved).diff(moment(rt.dtAccepted), 'HH:mm:ss')).minutes()} minute(s)&nbsp;
                            </Descriptions.Item>
                          )}
                          <Descriptions.Item label="Remarks">
                            {rt.remarks}
                          </Descriptions.Item>
                          {rt.imgUrl && (
                            <Descriptions.Item label="Uploads">
                              {rt.imgUrl.split(";;;").map((img) => {
                                return (
                                  <AntdImage
                                    width={150}
                                    height={150}
                                    className="object-cover"
                                    key={img}
                                    src={
                                      import.meta.env.VITE_BASE_URL + "/" + img
                                    }
                                    alt="Image"
                                  />
                                );
                              })}
                            </Descriptions.Item>
                          )}
                        </Descriptions>
                      ))}
                  </Descriptions.Item>
                </Descriptions>
              )
            )}
        </div>
      </div>
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
    departmentName,
    departmentType,
    mobileNumber,
    imageUrl,
  } = ticketInfo;
  console.log(ticketInfo)
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
        value: latitude && longitude && (
          <Descriptions.Item label="Coordinates">
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
          </Descriptions.Item>
        ),
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
                <AntdImage
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
      { 
        label: "Citizen", 
        value: <div className="flex flex-col">
          <span>{`${firstName} ${lastName}`}</span>
          {departmentName || departmentType ? (
            <div>
              <Tag color="red" className="mx-0">
                {departmentType} - {departmentName}
              </Tag>
            </div>
          ) : null}
        </div>
      },
      {
        label: "Contact Number",
        value: mobileNumber,
      },
    ];
};

export default TicketReport;
