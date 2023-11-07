import { Table } from "ant-table-extensions";
import { Image, Tag, message } from "antd";
import moment from "moment";
import React from "react";
import { includeRTReport } from "../../../../../store/api/reports-api";
import { useState } from "react";
import Button from "../../../../UI/Button/Button";

const Excluded = ({ reports, reload, onClose }) => {
  const [loading, setLoading] = useState(null);
  const includeReportHandler = async (id) => {
    setLoading(id);
    const result = await includeRTReport({ param: id });
    if (result.name === "AxiosError") {
      message.error(result.response.data.message);
    } else {
      message.success(result.data.message);
      reload();
      onClose();
    }
    setLoading(null);
  };

  const columns = [
    {
      title: "Actions",
      dataIndex: null,
      render: (d) => (
        <Button
          type="primary"
          text="Include"
          onClick={() => includeReportHandler(d.id)}
          loading={d.id === loading}
        />
      ),
    },
    {
      title: "Department Name",
      dataIndex: "deptName",
    },
    {
      title: "Responder Name",
      dataIndex: null,
      render: (d) => `${d.firstName} ${d.lastName}`,
    },
    {
      title: "Timestamps",
      dataIndex: null,
      render: (d) => (
        <div className="flex flex-col justify-center items-start gap-1">
          {d.dtAccepted && (
            <div>
              <Tag color="blue">Accepted</Tag>
              <span>{moment(d.dtAccepted).format("lll")}</span>
            </div>
          )}
          {d.dtArrived && (
            <div>
              <Tag color="blue">Arrived</Tag>
              <span>{moment(d.dtArrived).format("lll")}</span>
            </div>
          )}
          {d.dtCancelled && (
            <div>
              <Tag color="red">Canceled</Tag>
              <span>{moment(d.dtCancelled).format("lll")}</span>
            </div>
          )}
          {d.dtDeclined && (
            <div>
              <Tag color="red">Declined</Tag>
              <span>{moment(d.dtDeclined).format("lll")}</span>
            </div>
          )}
          {d.dtResolved && (
            <div>
              <Tag color="green">Resolved</Tag>
              <span>{moment(d.dtResolved).format("lll")}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
    },
    {
      title: "Uploads",
      dataIndex: "imgUrl",
      render: (d) => {
        if (!d) return "No uploads";
        const links = d.split(";;;");

        return links.map((img) => {
          return (
            <Image
              width={150}
              height={150}
              className="object-cover"
              key={img}
              src={import.meta.env.VITE_BASE_URL + "/" + img}
              alt="Image"
            />
          );
        });
      },
    },
  ];

  return <Table rowKey={"id"} columns={columns} dataSource={reports} />;
};

export default Excluded;
