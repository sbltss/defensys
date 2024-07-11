import { Table } from "ant-table-extensions";
import { Drawer, Form } from "antd";
import moment from "moment";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { PlusIcon } from "../../../../../assets/icons/Icons";
import { searchFunction } from "../../../../../helpers/searchFunction";
import { resourcesActions } from "../../../../../store/store";
import Badge from "../../../../UI/Badge/Badge";
import {
  default as ActionButton,
  default as Button,
} from "../../../../UI/Button/Button";
import MenuButton from "../../../../UI/Menu/MenuButton";
import SupervisorForm from "./SupervisorForm";
const {
  fetchResources,
  deactivateAccount,
  reactivateAccount,
  setMode,
  setSelectedAccount,
} = resourcesActions;

const Supervisors = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const closeDrawerHandler = () => {
    dispatch(setMode(false));
  };

  const openDrawerHandler = (e) => {
    dispatch(setMode(e));
    if (e !== "adding") dispatch(setSelectedAccount(e));
  };
  const resources = useSelector((state) => state.resources);
  const { token } = useSelector((state) => state.auth);
  const {
    supervisorList,
    isLoading,
    mode,
    updateLoading,
    selectedAccount,
    addLoading,
  } = resources;

  const deactivateAccountHandler = (e) => {
    dispatch(deactivateAccount({ listType: "supervisorList", accountId: e }));
  };

  const reactivateAccountHandler = (e) => {
    dispatch(reactivateAccount({ listType: "supervisorList", accountId: e }));
  };
  useEffect(() => {
    if (token)
      dispatch(
        fetchResources({ toFetch: ["supervisorList"], existing: resources })
      );
  }, [token]);

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
      title: "Name",
      dataIndex: null,
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
      render: (d) => `${d.firstName} ${d.lastName}`,
    },
    {
      title: "Mobile Number",
      dataIndex: "contactNumber",
      sorter: (a, b) => a.contactNumber.localeCompare(b.contactNumber),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Date Updated",
      dataIndex: "dateUpdated",
      sorter: (a, b) => a.dateUpdated.localeCompare(b.dateUpdated),
      defaultSortOrder: "descend",
      render: (data) => moment(data).format("lll"),
    },
  ];

  return (
    <>
      <Helmet>
        <title>Defensys | Accounts - Supervisors</title>
      </Helmet>
      <div className="bg-white rounded w-full shadow p-4 flex flex-col">
        <div className="border-b flex flex-row justify-between p-2">
          <span className="font-semibold text-xl">Supervisors</span>
          <Button
            text="Add"
            type="primary"
            Icon={PlusIcon}
            onClick={() => openDrawerHandler("adding")}
          />
        </div>
        <div className="w-full h-full overflow-hidden">
          <Table
            searchableProps={{
              searchFunction: searchFunction,
            }}
            searchable={true}
            pagination={{
              showSizeChanger: true,
              defaultPageSize: 10,
              pageSizeOptions: [10, 20, 50, 100],
              showTotal: (total, range) =>
                `${range[0]} - ${range[1]} of ${total} items`,
            }}
            rowKey={"accountId"}
            columns={columns}
            loading={isLoading}
            dataSource={supervisorList}
            scroll={{ y: "60vh", x: "100vw" }}
          />
        </div>
      </div>
      <Drawer
        placement="right"
        title={
          mode !== "adding"
            ? "Edit Supervisor Information"
            : "Create a New Supervisor Account"
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
        {mode === "adding" && <SupervisorForm form={form} type="add" />}
        {!!mode && mode !== "adding" && (
          <SupervisorForm
            form={form}
            type="edit"
            selectedAccount={selectedAccount}
          />
        )}
      </Drawer>
    </>
  );
};

export default Supervisors;
