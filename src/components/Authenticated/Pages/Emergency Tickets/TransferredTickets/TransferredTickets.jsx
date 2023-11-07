import { Table } from "ant-table-extensions";
import { Tag, message } from "antd";
import moment from "moment";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFilters } from "../../../../../helpers";
import { searchFunction } from "../../../../../helpers/searchFunction";
import {
  acceptTransferredTicket,
  cancelTransferredTicket,
  declineTransferredTicket,
} from "../../../../../store/api/ticket-api";
import { resourcesActions, ticketsActions } from "../../../../../store/store";
import Badge from "../../../../UI/Badge/Badge";
import Button from "../../../../UI/Button/Button";
import TransferredTicketDrawer from "./Drawers/TransferredTicketDrawer";
const { fetchResources } = resourcesActions;

const { fetchTransferredTickets, selectTransferredTicket } = ticketsActions;

const TransferredTickets = () => {
  const dispatch = useDispatch();
  const {
    transferredTickets,
    fetchTransferredTicketLoading,
    selectedTransferredTicket,
  } = useSelector((state) => state.tickets);
  const { currentUser } = useSelector((state) => state.auth);

  const resources = useSelector((state) => state.resources);
  const { agentList, supervisorList } = resources;
  const { caseTypes } = resources;

  useEffect(() => {
    if (
      resources.agentList.length === 0 ||
      resources.supervisorList.length === 0
    )
      dispatch(
        fetchResources({
          toFetch: ["agentList", "supervisorList"],
          existing: resources,
        })
      );
  }, [dispatch, resources]);

  useEffect(() => {
    dispatch(fetchTransferredTickets());
  }, [dispatch]);

  const getTypeName = (id) => {
    return caseTypes?.filter((ct) => +ct.id === +id)[0]?.typeName;
  };

  const selectTransferredTicketHandler = (e) => {
    dispatch(selectTransferredTicket(e));
  };

  const changeTransferStatus = async (transferId, status) => {
    const apiMap = {
      cancel: cancelTransferredTicket,
      accept: acceptTransferredTicket,
      decline: declineTransferredTicket,
    };
    const messageMap = {
      cancel: "Canceling transfer request...",
      accept: "Accepting transfer request...",
      decline: "Declining transfer request...",
    };
    let messageLoading;
    messageLoading = message.loading(messageMap[status]);
    const request = await apiMap[status]({
      param: transferId,
    });
    messageLoading();
    if (!request || request.name === "AxiosError") {
      message.error(request.response.data.message);
    } else {
      message.success(request.data.message);
      selectTransferredTicketHandler(null);
    }
  };

  const columns = [
    {
      width: "150px",
      title: "",
      dataIndex: null,
      render: (data) => {
        if (data.status === 0)
          if (data.transferFrom === currentUser.accountId)
            return (
              <Button
                onClick={() => changeTransferStatus(data.id, "cancel")}
                type={"danger"}
                text={"Cancel"}
              />
            );
          else
            return (
              <Button
                onClick={() => selectTransferredTicketHandler(data)}
                type={"primary"}
                text={"View"}
              />
            );

        if (data.status === 2 && data.transferTo === currentUser.accountId)
          return <span>View at accepted ticket</span>;
      },
    },

    {
      width: "200px",
      title: "Ticket Number",
      dataIndex: "transactionNumber",
      render: (data) => <nobr>{data}</nobr>,
    },
    {
      width: "150px",
      title: "Status",
      dataIndex: "status",
      render: function (data) {
        return +data === -1 ? (
          <Tag color="red">Cancelled</Tag>
        ) : +data === 0 ? (
          <Tag color="yellow">Pending</Tag>
        ) : +data === 1 ? (
          <Tag color="red">Declined</Tag>
        ) : +data === 2 ? (
          <Tag color="green">Accepted</Tag>
        ) : null;
      },
    },
    {
      width: "150px",
      title: "Transfer Type",
      dataIndex: null,
      render: (d) =>
        d.transferFrom === currentUser.accountId ? (
          <Tag color="red">Outgoing</Tag>
        ) : (
          <Tag color="orange">Incoming</Tag>
        ),
    },

    {
      width: "150px",
      title: "Transfer from/to",
      dataIndex: null,
      render: (data) => {
        if (data.transferFrom === currentUser.accountId) {
          let selected = agentList.filter((agent) => {
            return agent.accountId === data.transferTo;
          });
          if (selected.length > 0)
            return `${selected[0]?.firstName} ${selected[0]?.lastName}`;
          let selected2 = supervisorList.filter((agent) => {
            return agent.accountId === data.transferTo;
          });
          if (selected2.length > 0)
            return `${selected2[0]?.firstName} ${selected2[0]?.lastName} (Supervisor)`;
          return "";
        } else {
          let selected = agentList.filter((agent) => {
            return agent.accountId === data.transferFrom;
          });
          if (selected.length > 0)
            return `${selected[0]?.firstName} ${selected[0]?.lastName}`;
          let selected2 = supervisorList.filter((agent) => {
            return agent.accountId === data.transferFrom;
          });
          if (selected2.length > 0)
            return `${selected2[0]?.firstName} ${selected2[0]?.lastName} (Supervisor)`;
          return "";
        }
      },
    },
    {
      width: "150px",
      title: "Transfer Remarks",
      dataIndex: "remarks",
    },
    {
      width: "150px",
      title: "Type",
      dataIndex: "caseType",
      render: (data) => <Badge type="caseType" text={getTypeName(data)} />,

      filters: getFilters(transferredTickets, "caseType", getTypeName),
      onFilter: (value, record) => record.caseType === value,
    },
    {
      width: "150px",
      title: "Content",
      dataIndex: "content",
    },
    {
      width: "150px",
      title: "Address",
      dataIndex: "address",
    },
    {
      width: "150px",
      title: "Date Updated",
      dataIndex: "dateUpdated",
      render: (data) => moment(data).format("lll"),

      sorter: (a, b) => {
        return a.dateUpdated.localeCompare(b.Updated);
      },
      defaultSortOrder: "descend",
      sortDirections: ["ascend", "descend", "ascend"],
    },
    {
      width: "150px",
      title: "Date Created",
      dataIndex: "dateCreated",
      render: (data) => moment(data).format("lll"),

      sorter: (a, b) => {
        return a.dateCreated.localeCompare(b.Created);
      },
      defaultSortOrder: "descend",
      sortDirections: ["ascend", "descend", "ascend"],
    },
  ];
  return (
    <div className="bg-white p-2">
      <TransferredTicketDrawer
        open={!!selectedTransferredTicket}
        closeDrawer={() => selectTransferredTicketHandler(null)}
        selectedTransferredTicket={selectedTransferredTicket}
        changeTransferStatus={changeTransferStatus}
      />
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
        loading={fetchTransferredTicketLoading}
        dataSource={transferredTickets}
        scroll={{ y: "60vh", x: "100vh" }}
      />
    </div>
  );
};

export default TransferredTickets;
