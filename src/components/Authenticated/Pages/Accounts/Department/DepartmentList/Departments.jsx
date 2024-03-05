import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Button from "../../../../../UI/Button/Button";
import { PlusIcon } from "../../../../../../assets/icons/Icons";
import { Table } from "ant-table-extensions";
import { Drawer, Form, Select, message } from "antd";
import DepartmentForm from "./DepartmentForm";
import { useSelector, useDispatch } from "react-redux";
import { resourcesActions } from "../../../../../../store/store";
import moment from "moment";
import MenuButton from "../../../../../UI/Menu/MenuButton";
import ActionButton from "../../../../../UI/Button/Button";
import Badge from "../../../../../UI/Badge/Badge";
import { searchFunction } from "../../../../../../helpers/searchFunction";
import { getCommandCenters } from "../../../../../../store/api/adminFn-api";
const {
  updateResources,
  fetchResources,
  deactivateAccount,
  reactivateAccount,
  setMode,
  setSelectedAccount,
  setCommandCenters,
} = resourcesActions;

const Departments = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { commandCenters } = useSelector((state) => state.resources);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [selectedCc, setSelectedCc] = useState(null);
  const { currentUser } = useSelector((state) => state.auth);

  const closeDrawerHandler = () => {
    dispatch(setMode(false));
  };

  const openDrawerHandler = (e) => {
    dispatch(setMode(e));
    if (e !== "adding") dispatch(setSelectedAccount(e));
  };
  const resources = useSelector((state) => state.resources);
  const {
    departmentList,
    isLoading,
    mode,
    updateLoading,
    selectedAccount,
    addLoading,
    deptTypeList,
  } = resources;

  const deactivateAccountHandler = (e) => {
    dispatch(deactivateAccount({ listType: "departmentList", accountId: e }));
  };

  const reactivateAccountHandler = (e) => {
    dispatch(reactivateAccount({ listType: "departmentList", accountId: e }));
  };
  useEffect(() => {
    if (!!mode) {
      dispatch(
        updateResources({
          toFetch: ["deptTypeList"],
        })
      );
    }
  }, [mode]);
  useEffect(() => {
    dispatch(
      fetchResources({
        toFetch: ["departmentList", "deptTypeList"],
        existing: resources,
      })
    );
  }, []);

  const fetchCommandCenters = async () => {
    setFetchLoading(true);
    const request = await getCommandCenters();

    if (!request || request.name === "AxiosError") {
      message.error(request?.response.data.message);
    } else {
      dispatch(setCommandCenters(request.data));
    }
    setFetchLoading(false);
  };

  useEffect(() => {
    if (commandCenters.length === 0 && currentUser.accountType === "superadmin")
      fetchCommandCenters();
  }, [commandCenters.length]);
  const columns = [
    {
      title: "Action",
      dataIndex: null,
      render: (d) => (
        <ActionButton
          type="primary"
          text="Edit"
          onClick={() => openDrawerHandler(d)}
        />
        // <MenuButton type="primary" text="Action">
        //   <ActionButton
        //     type="menu"
        //     text="Edit"
        //     onClick={() => openDrawerHandler(d)}
        //   />
        //   {d.isDeleted === 0 && (
        //     <ActionButton
        //       type="menu"
        //       text="Deactivate"
        //       onClick={() => deactivateAccountHandler(d.accountId)}
        //     />
        //   )}
        //   {d.isDeleted === 1 && (
        //     <ActionButton
        //       type="menu"
        //       text="Reactivate"
        //       onClick={() => reactivateAccountHandler(d.accountId)}
        //     />
        //   )}
        // </MenuButton>
      ),
    },
    // {
    //   title: "Status",
    //   dataIndex: "isDeleted",
    //   render: (d) => (
    //     <Badge
    //       type={d === 0 ? "active" : "deactivated"}
    //       text={d === 0 ? "Active" : "Deactivated"}
    //     />
    //   ),
    //   defaultSortOrder: "ascend",
    //   sorter: (a, b) =>
    //     a.isDeleted.toString().localeCompare(b.isDeleted.toString()),
    // },
    {
      title: "Account ID",
      dataIndex: "accountId",
    },
    {
      title: "Department Type",
      dataIndex: "deptDesc",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Mobile Number",
      dataIndex: "contactNumber",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Date Updated",
      dataIndex: "dateUpdated",
      render: (data) => moment(data).format("lll"),
    },
  ];
  return (
    <>
      <Helmet>
        <title>Defensys | Accounts - Departments</title>
      </Helmet>
      <div className="bg-white rounded w-full shadow p-4 flex flex-col">
        <div className="border-b flex flex-row justify-between p-2">
          <span className="font-semibold text-xl">Departments</span>
          <Button
            text="Add"
            type="primary"
            Icon={PlusIcon}
            onClick={() => openDrawerHandler("adding")}
          />
        </div>
        {currentUser.accountType === "superadmin" && (
          <div className="pt-3 pb-2">
            <Select
              placeholder="Select command center"
              loading={fetchLoading}
              className="min-w-[400px]"
              value={selectedCc}
              onChange={(e) => setSelectedCc(e)}
            >
              <Select.Option>
                {selectedCc ? "Select all" : "Select command center to filter"}
              </Select.Option>
              {commandCenters.map((cc) => (
                <Select.Option
                  key={cc.commandCenterId}
                  value={cc.commandCenterId}
                >
                  {cc.name}
                </Select.Option>
              ))}
            </Select>
          </div>
        )}
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
            rowKey={"accountId"}
            columns={columns}
            loading={isLoading}
            dataSource={departmentList.filter(
              (d) => !selectedCc || d.commandCenterId === selectedCc
            )}
            scroll={{ y: "60vh", x: "100vw" }}
          />
        </div>
      </div>
      <Drawer
        placement="right"
        title={
          mode !== "adding"
            ? "Edit Department Information"
            : "Create a New Department Account"
        }
        onClose={closeDrawerHandler}
        open={!!mode}
        width={"400px"}
        footer={
          <div className="w-full flex flex-row justify-end">
            <Button
              loading={updateLoading || addLoading}
              text={mode !== "adding" ? "Update Account" : "Create Account"}
              type="primary"
              onClick={() => form.submit()}
            />
          </div>
        }
      >
        {mode === "adding" && (
          <DepartmentForm
            form={form}
            type="add"
            deptTypeList={deptTypeList}
            existingDepts={departmentList}
          />
        )}
        {!!mode && mode !== "adding" && (
          <DepartmentForm
            form={form}
            type="edit"
            selectedAccount={selectedAccount}
            deptTypeList={deptTypeList}
            existingDepts={departmentList}
          />
        )}
      </Drawer>
    </>
  );
};

export default Departments;
