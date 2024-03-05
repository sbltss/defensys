import { Table } from "ant-table-extensions";
import { Form, message } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import UseGeocoder from "../../../../Hooks/use-geocoder";
import { PlusIcon } from "../../../../assets/icons/Icons";
import { searchFunction } from "../../../../helpers/searchFunction";
import { fetchLgus } from "../../../../store/api/resources-api";
import Button from "../../../UI/Button/Button";
import MenuButton from "../../../UI/Menu/MenuButton";
import DirectoryDrawer from "./DirectoryDrawer";
import { useSelector } from "react-redux";

const DirectoriesPage = () => {
  const [form] = Form.useForm();
  const [mode, setMode] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [lgu, setLgus] = useState([]);
  const { currentUser } = useSelector((state) => state.auth);

  const fetchLgusHandler = async () => {
    setFetchLoading(true);
    const request = await fetchLgus();
    if (request.name === "AxiosError")
      message.error(request.response.data.message);
    else setLgus(request.data);
    setFetchLoading(false);
  };

  useEffect(() => {
    fetchLgusHandler();
  }, []);

  const columns = [
    {
      title: "Action",
      dataIndex: null,
      render: (d) => (
        <MenuButton type="primary" text="Action">
          <Button type="menu" text="Edit" onClick={() => setMode(d)} />
        </MenuButton>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Coordinates",
      dataIndex: null,
      render: (d) => (
        <div className="flex flex-row justify-between">
          {+d.latitude && +d.longitude && (
            <>
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
            </>
          )}
        </div>
      ),
    },
    {
      title: "Date Updated",
      dataIndex: "dateUpdated",
      render: (data) => moment(data).format("lll"),
    },
  ];
  return (
    <>
      <DirectoryDrawer
        currentUser={currentUser}
        mode={mode}
        setMode={setMode}
        form={form}
        reload={(e, mode) => {
          if (mode === "add") {
            setLgus((prevState) => [...prevState, e]);
          } else {
            setLgus((prevState) =>
              prevState.map((s) => {
                if (s.cityId === e.cityId) return { ...s, ...e };
                else return s;
              })
            );
          }
        }}
      />
      <Helmet>
        <title>Defensys | Accounts - Directories</title>
      </Helmet>
      <div className="bg-white rounded w-full shadow p-4 flex flex-col">
        <div className="border-b flex flex-row justify-between p-2">
          <span className="font-semibold text-xl">Directories</span>
          {currentUser.accountType === "superadmin" && (
            <Button
              text="Add"
              type="primary"
              Icon={PlusIcon}
              onClick={() => setMode("add")}
            />
          )}
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
            rowKey={"cityId"}
            columns={columns}
            loading={fetchLoading}
            dataSource={lgu}
            scroll={{ y: "60vh", x: "100vw" }}
          />
        </div>
      </div>
    </>
  );
};

export default DirectoriesPage;
