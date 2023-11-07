import { Drawer, message } from "antd";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import {
  fetchSensorArchives,
  fetchSensorData,
} from "../../../../../store/api/resources-api";
import WeatherArchiveTable from "../Tables/WeatherArchiveTable";

const ArchiveDrawer = ({ selectedSensor, archiveOpen, setArchiveOpen }) => {
  const [fetchLoading, setFetchLoading] = useState(false);
  const [data, setData] = useState([]);

  const fetchData = async (body) => {
    setFetchLoading(true);
    const request = await fetchSensorArchives({ body: body });
    if (request.name === "AxiosError") {
      message.error(request.response.data.message);
    } else {
      setData(request.data);
    }
    setFetchLoading(false);
  };

  useEffect(() => {
    if ((selectedSensor?.sensorId, archiveOpen)) {
      fetchData({ sensorId: selectedSensor?.sensorId });
    }
  }, [archiveOpen, selectedSensor?.sensorId]);

  return (
    <Drawer
      placement="bottom"
      title={
        selectedSensor && archiveOpen
          ? `Weather Photo Archive of ${selectedSensor.name}`
          : ""
      }
      onClose={() => setArchiveOpen(false)}
      open={!!selectedSensor && !!archiveOpen}
      height={"80vh"}
    >
      <WeatherArchiveTable
        data={data}
        fetchLoading={fetchLoading}
        setData={setData}
      />
    </Drawer>
  );
};

export default ArchiveDrawer;
