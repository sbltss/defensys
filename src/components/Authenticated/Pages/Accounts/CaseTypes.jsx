import { Table } from "ant-table-extensions";
import { Drawer } from "antd";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { searchFunction } from "../../../../helpers/searchFunction";
import { resourcesActions } from "../../../../store/store";
const { fetchResources } = resourcesActions;

const columns = [
  // {
  //   title: "Action",
  //   dataIndex: null,
  //   render: () => (
  //     <MenuButton type="primary">
  //       <ActionButton type="menu" text="Edit" />
  //       <ActionButton type="menu" text="Delete" />
  //     </MenuButton>
  //   ),
  // },
  {
    title: "Type ID",
    dataIndex: "id",
  },
  {
    title: "Type Name",
    dataIndex: "typeName",
  },
  {
    title: "Emergency Type",
    dataIndex: "emergencyType",
    render: (d) => (d === 0 ? "Emergency" : "Non-Emergency"),
  },
  {
    title: "Marker",
    dataIndex: "icon",
    render: (d) =>
      d && <img src={import.meta.env.VITE_BASE_URL + "/" + d} alt="marker" />,
  },
];

const CaseTypes = () => {
  const [mode, setMode] = useState(false);
  const closeDrawerHandler = () => {
    setMode(false);
  };
  const openDrawerHandler = (e) => {
    setMode(e);
  };
  const dispatch = useDispatch();
  const resources = useSelector((state) => state.resources);
  const { token } = useSelector((state) => state.auth);
  const { caseTypes, isLoading } = resources;
  useEffect(() => {
    if (token)
      dispatch(fetchResources({ toFetch: ["caseTypes"], existing: resources }));
  }, [token]);
  const addHandler = () => {
    alert("adding");
  };
  return (
    <>
      <Helmet>
        <title>Defensys | Accounts - CaseTypes</title>
      </Helmet>
      <div className="bg-white rounded w-full h-full shadow p-4 flex flex-col">
        <div className="border-b flex flex-row justify-between p-2">
          <span className="font-semibold text-xl">Case Types</span>
          {/* <Button
            text="Add"
            type="primary"
            Icon={PlusIcon}
            onClick={() => openDrawerHandler("adding")}
          /> */}
        </div>
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
            rowKey={"id"}
            columns={columns}
            loading={isLoading}
            dataSource={caseTypes}
            scroll={{ y: "60vh", x: "100vw" }}
          />
        </div>
      </div>
      <Drawer
        title="Create a New Dispatcher Account"
        onClose={closeDrawerHandler}
        open={!!mode}
        width={600}
      >
        {mode === "adding" && "ADDING"}
        {!!mode && mode !== "adding" && "EDITING"}
      </Drawer>
    </>
  );
};

export default CaseTypes;
