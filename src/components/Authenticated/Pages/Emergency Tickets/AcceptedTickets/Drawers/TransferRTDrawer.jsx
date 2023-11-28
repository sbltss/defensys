import React from "react";
import { Drawer } from "antd";
import { searchFunction } from "../../../../../../helpers/searchFunction";
import { useDispatch, useSelector } from "react-redux";

const { selectAcceptedTicket } = ticketsActions;
const { selectChatTicket } = chatActions;

const TransferRTDrawer = ({ transferRT, setTransferRT, selectedRT }) => {
    const dispatch = useDispatch();
    const { acceptedTickets, fetchAcceptedTicketLoading } = useSelector(
        (state) => state.tickets
    );
    const { currentUser } = useSelector((state) => state.auth);
    const { caseTypes } = resources;

    const getTypeName = (id) => {
        return caseTypes?.filter((ct) => +ct.id === +id)[0]?.typeName;
    };

    const columns = [
        {
            width: "150px",
            title: "",
            dataIndex: null,
        },
        {
            width: "200px",
            title: "Type",
            dataIndex:
            currentUser.accountType === "agent" ? "caseTypeDesc" : "typeName",
            render: (data) => <Badge type="caseType" text={data} />,
            filters: getFilters(acceptedTickets, "caseType", getTypeName),
            onFilter: (value, record) =>
            currentUser.accountType === "agent"
                ? record.caseTypeDesc === value
                : record.typeName === value,
        },
        {
            width: "150px",
            title: "Injury",
            dataIndex: "withInjury",
            render: (data) => (
            <Badge type={data === 0 ? "withoutInjury" : "withInjury"} />
            ),
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
            dataIndex: null,
            render: (d) => {
            console.log(d)
            if (currentUser.accountType === "department" && d.status === 2)
                return <Badge type={"ticketStatus"} text={d.status} />;
            return (
                <Badge
                type={
                    currentUser.accountType === "agent"
                    ? "ticketStatus"
                    : "allocateStatus"
                }
                text={
                    currentUser.accountType === "agent" ? d.status : d.ticketStatus
                }
                />
            );
            },
        },
        {
            width: "200px",
            title: "Citizen",
            dataIndex: null,
            render: (data) => (
            <div className="flex flex-col items-center">
                <span>{`${data.firstName} ${data.lastName}`}</span>
                {!data.callerId && (
                <div>
                    <Tag color="red" className="mx-0">
                    Non-registered
                    </Tag>
                </div>
                )}
                {data?.departmentName || data?.departmentType ? (
                <div>
                    <Tag color="red" className="mx-0">
                    {data?.departmentType} - {data?.departmentName}
                    </Tag>
                </div>
                ) : null}
            </div>
            ),
        },
        {
            width: "150px",
            title: "Mobile",
            dataIndex: "mobileNumber",
        },
        {
            width: "150px",
            title: "Date",
            dataIndex: "dateCreated",
            render: (data) => moment(data).format("lll"),
            sorter: (a, b) => {
            return a.dateCreated.localeCompare(b.Created);
            },
            defaultSortOrder: "descend",
            sortDirections: ["ascend", "descend", "ascend"],
        },
        {
            title: "Created By",
            dataIndex: "createdBy",
            width: "150px",
        },
        {
            title: "Address",
            dataIndex: "address",
            width: "150px",
        },
    ];

    return (
        <Drawer
        height={"70vh"}
        onClose={() => {
            setAssigning(false);
        }}
        open={assigning}
        placement="bottom"
        title={"Transfer " + [selectedRT?.firstName, selectedRT?.lastName].join(" ") + "to other ticket."}
        >
        <div className="w-full h-full flex flex-row gap-4">
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
                rowKey={"transactionNumber"}
                columns={columns}
                loading={fetchAcceptedTicketLoading}
                dataSource={acceptedTickets}
                scroll={{ y: "60vh", x: "100vw" }}
            />
        </div>
        </Drawer>
    );
};

export default TransferRTDrawer;
