import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import moment from "moment";
import { getReportCategory } from "../../../../helpers";
import NunitoSansRegular from "../../../../assets/fonts/NunitoSans/NunitoSans_10pt-Regular.ttf";
import NunitoSansMedium from "../../../../assets/fonts/NunitoSans/NunitoSans_10pt-Medium.ttf";
import NunitoSansBold from "../../../../assets/fonts/NunitoSans/NunitoSans_10pt-Bold.ttf";
import logo from "../../../../assets/img/logo/logo.png";

const ReportPdf = ({ reportCategories, reportData, currentUser }) => {
  Font.register({
    family: "NunitoSans",
    fonts: [
      {
        fontWeight: 400,
        src: NunitoSansRegular,
      },
      {
        fontWeight: 500,
        src: NunitoSansMedium,
      },
      {
        fontWeight: 700,
        src: NunitoSansBold,
      },
    ],
  });
  const emergencyDetails = [
    {
      label: "Transaction Number",
      value: reportData?.transactionNumber,
    },
    {
      label: "Case Type",
      value: reportData?.caseTypeDesc,
    },
    {
      label: "Content",
      value: reportData?.content,
    },
    {
      label: "Address",
      value: reportData?.address,
    },
    {
      label: "Coordinates",
      value: `latitude: ${reportData?.latitude},  longitude: ${reportData?.longitude}`,
    },
    {
      label: "Date & Time Reported",
      value: reportData?.dateCreated
        ? moment(reportData?.dateCreated).format("LLL")
        : null,
    },
    {
      label: "Date & Time Assigned",
      value: reportData?.dtAssigned
        ? moment(reportData?.dtAssigned).format("LLL")
        : null,
    },
    {
      label: "Note From Dispatcher",
      value: reportData?.agentNote,
    },
    {
      label: "Report Category",
      value: getReportCategory(
        reportData?.reportCategory,
        reportData?.reportCategoryDesc,
        reportCategories
      ),
    },
  ];
  const citizenDetails = [
    {
      label: "Account ID",
      value: reportData?.callerId,
    },
    {
      label: "Citizen",
      value: `${reportData?.firstName} ${reportData?.lastName}`,
    },
    {
      label: "Contact Number",
      value: reportData?.mobileNumber,
    },
  ];
  return (
    <Document page>
      <Page size="A4" style={styles.page}>
        <View style={styles.ccContainer}>
          <View style={styles.ccImage}>
            <Image source={logo} />
          </View>
          <View style={styles.ccInfo}>
            <Text style={styles.ccName}>{currentUser.commandCenterName}</Text>
            <Text style={styles.ccAddress}>{currentUser.address}</Text>
          </View>
          {currentUser.logoUrl && (
            <View style={styles.ccImage}>
              <Image
                source={[
                  import.meta.env.VITE_BASE_URL,
                  "/",
                  currentUser.logoUrl,
                ].join("")}
              />
            </View>
          )}
        </View>
        <View style={styles.table} wrap={false}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Emergency Details</Text>
          </View>
          {emergencyDetails
            .filter((d) => d.value)
            .map((d) => (
              <View style={styles.tableRow} key={d.label}>
                <Text style={styles.label}>{d.label}</Text>
                <Text style={styles.value}>{d.value}</Text>
              </View>
            ))}
          {reportData?.imageUrl && (
            <View style={styles.tableRow}>
              <Text style={styles.label}>{"Reported Image"}</Text>
              <View style={styles.imageValueContainer}>
                <Image
                  style={styles.imageValue}
                  source={[
                    import.meta.env.VITE_BASE_URL,
                    "/",
                    reportData?.imageUrl,
                  ].join("")}
                />
              </View>
            </View>
          )}
        </View>
        <View style={styles.table} wrap={false}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Citizen Details</Text>
          </View>
          {citizenDetails
            .filter((d) => d.value)
            .map((d) => (
              <View style={styles.tableRow} key={d.label}>
                <Text style={styles.label}>{d.label}</Text>
                <Text style={styles.value}>{d.value}</Text>
              </View>
            ))}
        </View>

        <View style={styles.table} wrap={false}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Assigned Dispatchers</Text>
          </View>
          {reportData?.involvedAgent &&
            reportData?.involvedAgent.map((agent) => (
              <View
                style={styles.tableRow}
                key={`${agent.firstName} ${agent.lastName}`}
              >
                <Text
                  style={styles.label}
                >{`${agent.firstName} ${agent.lastName}`}</Text>
                <Text style={styles.value}>{agent.remarks}</Text>
              </View>
            ))}
        </View>

        {!!reportData &&
          reportData?.involvedDepartments
            .filter((dept) => !!dept?.responseTeams.find((rt) => rt.isIncluded))
            .map((department, idx) => (
              <>
                <View style={styles.table} key={idx} wrap={false}>
                  <View style={styles.tableHeader}>
                    <View style={styles.titleWithHeaderView}>
                      <Text style={styles.tableHeaderText}>
                        {department.name}
                      </Text>
                      {!!department?.responseTeams.find(
                        (rt) => rt.isVolunteer
                      ) && (
                        <View style={styles.volunteerTag}>
                          <Text style={styles.volunteerText}>
                            Volunteer Group
                          </Text>
                        </View>
                      )}
                    </View>
                    {/* <Text style={styles.tableHeaderText}>
                      {department.name}
                    </Text> */}
                  </View>

                  <View style={styles.tableRow}>
                    <Text style={styles.label}>{`Department Type`}</Text>
                    <Text style={styles.value}>{department.deptTypeDesc}</Text>
                  </View>

                  <View style={styles.tableRow}>
                    <Text style={styles.label}>{`Contact Number`}</Text>
                    <Text style={styles.value}>{department.contactNumber}</Text>
                  </View>

                  <View style={styles.tableRow}>
                    <Text style={styles.label}>{`Date Time Assigned`}</Text>
                    <Text style={styles.value}>
                      {moment(department.dateCreated).format("lll")}
                    </Text>
                  </View>
                  {department.dtAccepted && (
                    <View style={styles.tableRow}>
                      <Text style={styles.label}>{`Date Time Accepted`}</Text>
                      <Text style={styles.value}>
                        {moment(department.dtAccepted).format("lll")}
                      </Text>
                    </View>
                  )}

                  {department.dtDeclined && (
                    <View style={styles.tableRow}>
                      <Text style={styles.label}>{`Date Time Declined`}</Text>
                      <Text style={styles.value}>
                        {moment(department.dtDeclined).format("lll")}
                      </Text>
                    </View>
                  )}

                  {department.dtResolved && (
                    <View style={styles.tableRow}>
                      <Text style={styles.label}>{`Date Time Resolved`}</Text>
                      <Text style={styles.value}>
                        {moment(department.dtResolved).format("lll")}
                      </Text>
                    </View>
                  )}

                  <View style={styles.tableRow}>
                    <Text style={styles.label}>{`Remarks`}</Text>
                    <Text style={styles.value}>{department.remarks}</Text>
                  </View>
                </View>
                {department.responseTeams
                  .filter((rt) => rt.isIncluded)
                  .map((rt, idx) => (
                    <View style={styles.table} key={idx} wrap={false}>
                      <View style={styles.tableHeader}>
                        {/* <Text
                          style={styles.tableHeaderText}
                        >{`${department.name} - ${rt.firstName} ${rt.lastName}`}</Text> */}
                        <View style={styles.titleWithHeaderView}>
                          <Text
                            style={styles.tableHeaderText}
                          >{`${department.name} - ${rt.firstName} ${rt.lastName}`}</Text>
                          {rt.isVolunteer && (
                            <View style={styles.volunteerTag}>
                              <Text style={styles.volunteerText}>
                                Volunteer Responder
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                      <View style={styles.tableRow}>
                        <Text style={styles.label}>{`Response Team Type`}</Text>
                        <Text style={styles.value}>{rt.type}</Text>
                      </View>
                      <View style={styles.tableRow}>
                        <Text style={styles.label}>{`Plate Number`}</Text>
                        <Text style={styles.value}>{rt.plateNumber}</Text>
                      </View>
                      <View style={styles.tableRow}>
                        <Text style={styles.label}>{`Contact Number`}</Text>
                        <Text style={styles.value}>{rt.contactNumber}</Text>
                      </View>
                      <View style={styles.tableRow}>
                        <Text style={styles.label}>{`Date Time Assigned`}</Text>
                        <Text style={styles.value}>{rt.dateCreated}</Text>
                      </View>
                      {rt.dtAccepted && (
                        <View style={styles.tableRow}>
                          <Text
                            style={styles.label}
                          >{`Date Time Accepted`}</Text>
                          <Text style={styles.value}>
                            {moment(rt.dateCreated).format("lll")}
                          </Text>
                        </View>
                      )}
                      {rt.dtArrived && (
                        <View style={styles.tableRow}>
                          <Text
                            style={styles.label}
                          >{`Date Time Arrived`}</Text>
                          <Text style={styles.value}>
                            {moment(rt.dtAccepted).format("lll")}
                          </Text>
                        </View>
                      )}
                      {rt.dtCancelled && (
                        <View style={styles.tableRow}>
                          <Text
                            style={styles.label}
                          >{`Date Time Cancelled`}</Text>
                          <Text style={styles.value}>
                            {moment(rt.dtCancelled).format("lll")}
                          </Text>
                        </View>
                      )}
                      {rt.dtDeclined && (
                        <View style={styles.tableRow}>
                          <Text
                            style={styles.label}
                          >{`Date Time Declined`}</Text>
                          <Text style={styles.value}>
                            {moment(rt.dtDeclined).format("lll")}
                          </Text>
                        </View>
                      )}
                      {rt.dtResolved && (
                        <View style={styles.tableRow}>
                          <Text
                            style={styles.label}
                          >{`Date Time Resolved`}</Text>
                          <Text style={styles.value}>
                            {moment(rt.dtResolved).format("lll")}
                          </Text>
                        </View>
                      )}
                      <View style={styles.tableRow}>
                        <Text style={styles.label}>{`Remarks`}</Text>
                        <Text style={styles.value}>{rt.remarks}</Text>
                      </View>
                      {rt.imgUrl && (
                        <View style={styles.tableRow}>
                          <Text style={styles.label}>{`Reported Images`}</Text>
                          <View style={styles.imageMultiValueContainer}>
                            {rt.imgUrl.split(";;;").map((img) => (
                              <Image
                                key={img}
                                style={styles.imageMultiValue}
                                source={[
                                  import.meta.env.VITE_BASE_URL,
                                  "/",
                                  img,
                                ].join("")}
                              />
                            ))}
                          </View>
                        </View>
                      )}
                    </View>
                  ))}
              </>
            ))}
      </Page>
    </Document>
  );
};
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    padding: 22,
  },
  ccContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
  },
  ccImage: {
    flex: 2,
    maxWidth: 75,
    maxHeight: 75,
  },
  ccInfo: {
    flex: 4,
    display: "flex",
    flexDirection: "column",
  },
  ccName: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "NunitoSans",
  },
  ccAddress: {
    fontSize: 12,
    fontWeight: "medium",
    fontFamily: "NunitoSans",
  },
  headerContainer: {},
  header: {
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "NunitoSans",
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
    padding: 4,
    borderTopColor: "#333",
    borderTopWidth: 1,
    backgroundColor: "#fff",
  },
  label: {
    flex: 1,
    fontSize: 12,
    fontFamily: "NunitoSans",
  },
  value: {
    flex: 2,
    fontSize: 12,
    fontWeight: "medium",
    fontFamily: "NunitoSans",
  },
  imageValueContainer: {
    flex: 2,
    width: "100%",
  },
  imageValue: {
    maxWidth: "60%",
    maxHeight: 250,
  },
  table: {
    borderRadius: 2,
    borderColor: "#333",
    borderWidth: 1,
    backgroundColor: "#333",
    marginBottom: 20,
  },
  tableHeader: {
    backgroundColor: "#333",
    padding: 8,
  },
  tableHeaderText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "NunitoSans",
    fontWeight: "bold",
  },
  titleWithHeaderView: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  volunteerTag: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#feffe6",
    borderColor: "#ddc236",
    borderWidth: "1px",
    borderRadius: "4px",
    padding: "3 6",
    margin: "0 0 0 6",
  },
  volunteerText: {
    color: "#ddc236",
    fontSize: "12px",
    fontWeight: "bold",
    fontFamily: "NunitoSans",
  },
  imageMultiValueContainer: {
    flex: 2,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  imageMultiValue: {
    maxWidth: "40%",
    maxHeight: 200,
  },
});

export default ReportPdf;
