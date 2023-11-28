import { Table } from "ant-table-extensions";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlusIcon } from "../../../../../../../assets/icons/Icons";
import { searchFunction } from "../../../../../../../helpers/searchFunction";
import { ticketsActions } from "../../../../../../../store/store";
import Button from "../../../../../../UI/Button/Button";
import { Popconfirm } from "antd";
const { assignToResponseTeam } = ticketsActions;

const ResponseTeamTable = ({ assigning, responseTeams, rtLocations }) => {
  const dispatch = useDispatch();
  const { selectedAcceptedTicket, assignedResponseTeams } = useSelector(
    (state) => state.tickets
  );

  const confirm = (data) => {
    console.log(data);
  };

  const cancel = (e) => {
    console.log(e);
  };

  const columns = [
    {
      title: "Action",
      dataIndex: null,
      width: "200px",
      render: (data) => {
        if (
          assignedResponseTeams.filter((rt) => rt.accountId === data.accountId)
            .length > 0
        )
          // return <Popconfirm
          //   title="Transfer assignment"
          //   description="You are about to transfer responder to another assignment. Are you sure?"
          //   onConfirm={() => confirm(data)}
          //   onCancel={cancel}
          //   okText="Yes"
          //   cancelText="No"
          // >
          //   <Button type="primary" text="Already assigned" />
          // </Popconfirm>
          return <span className="flex justify-center">Already assigned</span>;
        if (+data.isAssigned === 1)
          return (
            <span className="flex justify-center">
              Assigned to another ticket
            </span>
          );
        if (!rtLocations?.[data.accountId]?.isOnline)
          return <span className="flex justify-center">Offline</span>;
        if (+data.availability === 0)
          return <span className="flex justify-center">Not Available</span>;
        return (
          <div className="flex justify-center">
            <Button
              onClick={() =>
                dispatch(
                  assignToResponseTeam({
                    body: {
                      transactionNumber:
                        selectedAcceptedTicket.transactionNumber,
                      rtaccountId: data.accountId,
                    },
                  })
                )
              }
              type="primary"
              text="Assign"
              Icon={PlusIcon}
            />
          </div>
        );
      },
      defaultSortOrder: "descend",
      sorter: (a, b) => {
        let aVal = "";
        let bVal = "";
        if (
          assignedResponseTeams.filter((rt) => rt.accountId === a.accountId)
            .length > 0
        )
          aVal = "b";
        else if (!rtLocations?.[a.accountId]?.isOnline) aVal = "c";
        else aVal = "a";

        if (
          assignedResponseTeams.filter((rt) => rt.accountId === b.accountId)
            .length > 0
        )
          bVal = "b";
        else if (!rtLocations?.[b.accountId]?.isOnline) bVal = "c";
        else bVal = "a";
        console.log(aVal);
        console.log(bVal);
        return bVal.localeCompare(aVal);
      },
    },
    {
      title: "First Name",
      dataIndex: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
    },
    {
      title: "Contact Number",
      dataIndex: "contactNumber",
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    // {
    //   title: "Location",
    //   dataIndex: null,
    //   render: (data) => {
    //     if (
    //       !rtLocations[data.accountId]?.longitude ||
    //       !rtLocations[data.accountId]?.latitude
    //     )
    //       return <span>Location unavailable</span>;
    //     return (
    //       <Button
    //         // onClick={() => selectChatTicketHandler(data)}
    //         type="muted"
    //         text="View location"
    //         Icon={MapIcon}
    //       />
    //     );
    //   },
    // },
  ];
  if (rtLocations)
    return (
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
        // loading={fetchAcceptedTicketLoading}
        dataSource={responseTeams}
        scroll={{ y: "46vh", x: "100vh" }}
      />
    );

  return null;
};

export default ResponseTeamTable;
