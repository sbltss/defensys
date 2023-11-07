import { Descriptions, Image, Spin } from "antd";
import moment from "moment";
import React from "react";

const { Item } = Descriptions;

const ReportInformation = ({ selectedOfflineReport }) => {
  if (!selectedOfflineReport)
    return (
      <div className="h-full w-full flex justify-center items-center">
        <Spin size="large" spinning={true}></Spin>
      </div>
    );
  const {
    firstName,
    lastName,
    type,
    contactNumber,
    imgUrl,
    remarks,
    dtAccepted,
    dtArrived,
    dtResolved,
  } = selectedOfflineReport;
  return (
    <Descriptions bordered size={"small"} column={1}>
      <Item label="Response Team">{`${firstName} ${lastName} (${type})`}</Item>
      <Item label="Contact Number">{contactNumber}</Item>
      <Item label="Response Team">{`${firstName} ${lastName} (${type})`}</Item>
      <Item label="Accepted at">{moment(dtAccepted).format("LLL")}</Item>
      <Item label="Arrived at">{moment(dtArrived).format("LLL")}</Item>
      <Item label="Resolved at">{moment(dtResolved).format("LLL")}</Item>
      <Item label="Remarks">{remarks}</Item>
      <Item label="Image">
        {/* <div className="max-h-24 h-full max-w-xs w-full"> */}
        {imgUrl.split(";;;").map((img) => {
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
        {/* </div> */}
      </Item>
    </Descriptions>
  );
};

export default ReportInformation;
