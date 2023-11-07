import { Table } from "ant-table-extensions";
import React from "react";
import { searchFunction } from "../../../../../helpers/searchFunction";
import moment from "moment";

const WeatherTable = ({ data, fetchLoading }) => {
  const columns = [
    {
      title: "Date Time",
      dataIndex: "dateCreated",
      render: (data) => moment(data).format("lll"),
    },
    {
      title: "Avg Air Pressure",
      dataIndex: "avgAirPressure",
    },
    {
      title: "Avg Humidity",
      dataIndex: "avgHumidity",
    },
    {
      title: "Avg Illumination",
      dataIndex: "avgIllumination",
    },
    {
      title: "Avg Noise",
      dataIndex: "avgNoise",
    },
    {
      title: "Avg Pm10",
      dataIndex: "avgPm10",
    },
    {
      title: "Avg Pm25",
      dataIndex: "avgPm25",
    },
    {
      title: "Avg RainFall",
      dataIndex: "avgRainFall",
    },
    {
      title: "Avg Temperature",
      dataIndex: "avgTemperature",
    },
    {
      title: "Avg Wind Direction",
      dataIndex: "avgWindDirection",
    },
    {
      title: "Avg Wind Speed",
      dataIndex: "avgWindSpeed",
    },
    {
      title: "Largest Wind Level",
      dataIndex: "largestWindLvl",
    },
  ];
  return (
    <div className="w-full h-full">
      <Table
        searchableProps={{
          searchFunction: searchFunction,
        }}
        searchable={true}
        pagination={{
          showSizeChanger: true,
          defaultPageSize: 10,
          pageSizeOptions: [10, 20, 50, 100],
        }}
        rowKey={"weatherId"}
        columns={columns}
        loading={fetchLoading}
        dataSource={data}
        scroll={{ y: "60vh", x: "100vw" }}
      />
    </div>
  );
};

export default WeatherTable;
