import { DatePicker, Drawer, message } from "antd";
import React from "react";
import Button from "../../../../UI/Button/Button";
import { useState } from "react";
import { useEffect } from "react";
import dayjs from "dayjs";
import WeatherTable from "../Tables/WeatherTable";
import { fetchSensorData } from "../../../../../store/api/resources-api";
import FloodTable from "../Tables/FloodTable";
import ArchiveDrawer from "./ArchiveDrawer";

const DataDrawer = ({ selectedSensor, setSelectedSensor }) => {
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [data, setData] = useState([]);

  const [archiveOpen, setArchiveOpen] = useState(false);

  const dateRangeChangedHandler = (e) => {
    setSelectedDateRange(e);
  };

  const fetchData = async (body) => {
    setFetchLoading(true);
    const request = await fetchSensorData({ body: body });
    if (request.name === "AxiosError") {
      message.error(request.response.data.message);
    } else {
      setData(request.data);
    }
    setFetchLoading(false);
  };

  useEffect(() => {
    setSelectedDateRange([dayjs().subtract(1, "week"), dayjs()]);
  }, []);

  useEffect(() => {
    if (selectedDateRange && selectedSensor?.sensorId) {
      const body = {
        sensorId: selectedSensor?.sensorId,
        dateFrom: selectedDateRange[0].format("YYYY-MM-DD"),
        dateTo: selectedDateRange[1].format("YYYY-MM-DD"),
      };
      fetchData(body);
    }
  }, [selectedDateRange, selectedSensor?.sensorId]);

  return (
    <Drawer
      placement="bottom"
      title={selectedSensor ? selectedSensor.name : ""}
      onClose={() => setSelectedSensor(null)}
      open={!!selectedSensor}
      height={"95vh"}
      extra={
        <DatePicker.RangePicker
          value={selectedDateRange}
          onChange={dateRangeChangedHandler}
          format={"MMM DD, YYYY"}
        />
      }
      footer={
        <div className="w-full flex flex-row justify-end">
          {selectedSensor?.type === "weather" && (
            <Button
              text={"View Archives"}
              type="primary"
              onClick={() => setArchiveOpen(true)}
            />
          )}
        </div>
      }
    >
      <ArchiveDrawer
        selectedSensor={selectedSensor}
        archiveOpen={archiveOpen}
        setArchiveOpen={setArchiveOpen}
      />
      {selectedSensor?.type === "weather" && (
        <WeatherTable data={data} fetchLoading={fetchLoading} />
      )}
      {selectedSensor?.type === "flood" && (
        <FloodTable data={data} fetchLoading={fetchLoading} />
      )}
    </Drawer>
  );
};

export default DataDrawer;
