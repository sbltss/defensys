import React, { useEffect } from "react";
import MenuButton from "../../../UI/Menu/MenuButton";
import Button from "../../../UI/Button/Button";
import { PlusIcon } from "../../../../assets/icons/Icons";
import { Helmet } from "react-helmet";
import moment from "moment";
import { useState } from "react";
import SensorForm from "./SensorForm";
import { getSensors } from "../../../../store/api/resources-api";
import { Drawer, Form, message } from "antd";
import { Table } from "ant-table-extensions";
import { searchFunction } from "../../../../helpers/searchFunction";
import { GoogleMap, Marker } from "@react-google-maps/api";
import UseGeocoder from "../../../../Hooks/use-geocoder";
import DataDrawer from "./Drawers/DataDrawer";

const SensorsPage = () => {
  const { setLocation, locationName, locationError } = UseGeocoder();
  const [form] = Form.useForm();
  const latitude = Form.useWatch("latitude", form);
  const longitude = Form.useWatch("longitude", form);

  const [mode, setMode] = useState(false);

  const [selectedSensor, setSelectedSensor] = useState(null);

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [sensors, setSensors] = useState([]);
  const [defaultProps] = useState({
    center: {
      lat: 14.533103851530154,
      lng: 121,
    },
    zoom: 11,
    mapId: "15f9baeb3890ce9f",
  });

  const fetchSensors = async () => {
    setFetchLoading(true);
    const request = await getSensors();
    if (request.name === "AxiosError")
      message.error(request.response.data.message);
    else setSensors(request.data);
    setFetchLoading(false);
  };

  useEffect(() => {
    fetchSensors();
  }, []);

  useEffect(() => {
    form.setFieldValue("address", locationName);
  }, [locationName]);

  const columns = [
    {
      width: 100,
      title: "Action",
      dataIndex: null,
      render: (d) => (
        <MenuButton type="primary" text="Action">
          <Button
            type="menu"
            text="View Data"
            onClick={() => setSelectedSensor(d)}
          />
          <Button type="menu" text="Edit" onClick={() => setMode(d)} />
        </MenuButton>
      ),
    },
    {
      width: 100,
      title: "Sensor ID",
      dataIndex: "sensorId",
    },
    {
      width: 100,
      title: "Type",
      dataIndex: "type",
      render: (d) => d.toUpperCase(),
    },
    {
      width: 150,
      title: "Name",
      dataIndex: "name",
    },
    {
      width: 200,
      title: "Location",
      dataIndex: "address",
    },
    {
      width: 200,
      title: "Coordinates",
      dataIndex: null,
      render: (d) => (
        <div className="flex flex-row justify-between">
          <div className="flex flex-col">
            <span>{`Latitude:${(+d.latitude).toFixed(4)}`}</span>
            <span>{`Longitude:${(+d.longitude).toFixed(4)}`}</span>
          </div>
          <div>
            <a
              className="text-blue-500"
              href={`https://www.google.com/maps/search/?api=1&query=${d.latitude},${d.longitude}`}
              target="_blank"
              rel="noreferrer"
            >
              View in Google Maps
            </a>
          </div>
        </div>
      ),
    },
    {
      width: 100,
      title: "Date Updated",
      dataIndex: "dateUpdated",
      render: (data) => moment(data).format("lll"),
    },
  ];
  return (
    <>
      <Helmet>
        <title>Defensys | Sensors</title>
      </Helmet>
      <DataDrawer
        selectedSensor={selectedSensor}
        setSelectedSensor={setSelectedSensor}
      />
        {/* Remove height */}
      <div className="bg-white rounded w-full shadow p-4 flex flex-col">
        <div className="border-b flex flex-row justify-between p-2">
          <span className="font-semibold text-xl">Sensors</span>
          <Button
            text="Add"
            type="primary"
            Icon={PlusIcon}
            onClick={() => setMode("add")}
          />
        </div>
        <div className="w-full h-full">
          <Table
            searchableProps={{
              searchFunction: searchFunction,
            }}
            searchable={true}
            pagination={{
              showTotal: (total, range) => `Showing ${range[1]} of ${total} records`,
              showSizeChanger: true,
              defaultPageSize: 10,
              pageSizeOptions: [10, 20, 50, 100],
            }}
            rowKey={"sensorId"}
            columns={columns}
            loading={fetchLoading}
            dataSource={sensors}
            scroll={{ y: "60vh", x: "100vw" }}
          />
        </div>
      </div>
      <Drawer
        placement="right"
        title={mode !== "add" ? "Edit Sensor Information" : "Add a New Sensor"}
        onClose={() => setMode(null)}
        open={!!mode}
        width={"400px"}
        footer={
          <div className="w-full flex flex-row justify-end">
            <Button
              loading={loading}
              text={mode !== "add" ? "Update Sensor" : "Create Sensor"}
              type="primary"
              onClick={() => form.submit()}
            />
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <SensorForm
            setMode={setMode}
            mode={mode}
            form={form}
            reload={fetchSensors}
            loading={loading}
            setLoading={setLoading}
          />
          <div className="w-full h-[500px]">
            <GoogleMap
              mapContainerStyle={{ height: "100%", width: "100%" }}
              options={defaultProps}
              onClick={(e) => {
                form.setFieldsValue({
                  latitude: e.latLng.lat(),
                  longitude: e.latLng.lng(),
                });
                setLocation({
                  lat: e.latLng.lat(),
                  lng: e.latLng.lng(),
                });
              }}
            >
              {latitude && longitude && (
                <Marker position={{ lat: +latitude, lng: +longitude }} />
              )}
            </GoogleMap>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default SensorsPage;
