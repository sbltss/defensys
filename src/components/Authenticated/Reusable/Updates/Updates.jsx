import React, { useEffect } from "react";
import { getUpdates, editUpdate } from "../../../../store/api/ticket-api";
import { useSelector } from "react-redux";
import { useState } from "react";
import moment from "moment";
import { Popconfirm, message } from "antd";
import EditUpdate from "../../Pages/Emergency Tickets/AcceptedTickets/Modals/EditUpdate";
import { EditIcon, TrashIcon } from "../../../../assets/icons/Icons";

const Updates = ({
  transactionNumber,
  accountId = undefined,
  accountType = undefined,
  editable = false,
  type = "agent",
}) => {
  const { socket } = useSelector((state) => state.auth);
  const [updates, setUpdates] = useState(null);
  const [updateEdit, setUpdateEdit] = useState(null);
  useEffect(() => {
    const fetchUpdates = async (transactionNumber) => {
      const response = await getUpdates({
        param: transactionNumber,
        queries: { accountId, accountType },
      });
      setUpdates(response.data);
    };
    if (transactionNumber) {
      fetchUpdates(transactionNumber);
    } else setUpdates(null);
  }, [transactionNumber, accountId, accountType]);
  const deleteUpdateHandler = async (update) => {
    const result = await editUpdate({
      body: { message: update.message, isDeleted: 1 },
      param: update.id,
    });
    if (!result || result.name === "AxiosError") {
      message.error(result?.response.data.message);
    } else {
      message.success(result.data.message);
    }
  };
  useEffect(() => {
    if (socket && type === "agent") {
      socket.on("ticket_update", async (data) => {
        if (data.transactionNumber === transactionNumber) {
          const response = await getUpdates({
            param: transactionNumber,
            queries: { accountId, accountType },
          });
          setUpdates(response.data);
        }
      });
    }
    if (socket && type === "department") {
      socket.on("ticket_update", async (data) => {
        if (data.transactionNumber === transactionNumber) {
          const response = await getUpdates({
            param: transactionNumber,
            queries: { accountId, accountType },
          });
          setUpdates(response.data);
        }
      });
    }
    return () => {
      if (socket && type === "agent") socket.off("ticket_update");
      if (socket && type === "department") socket.off("ticket_update");
    };
  }, [socket, transactionNumber]);
  if (updates && transactionNumber)
    return (
      <>
        <EditUpdate open={updateEdit} setOpen={setUpdateEdit} />
        {updates.map((update) => (
          <div key={update.id} className="flex flex-row gap-1 items-center">
            {editable && (
              <>
                <Popconfirm
                  title="Delete update"
                  description="Are you sure to delete this update?"
                  onConfirm={() => deleteUpdateHandler(update)}
                  okText="Yes"
                  okButtonProps={{
                    className:
                      "border-primary-900 bg-primary-700 hover:bg-primary-800 text-gray-100 ",
                  }}
                  cancelText="No"
                >
                  <button className="hover:text-gray-800 text-gray-500 duration-300">
                    <TrashIcon />
                  </button>
                </Popconfirm>
                <button
                  onClick={() => setUpdateEdit(update)}
                  className="hover:text-gray-800 text-gray-500 duration-300"
                >
                  <EditIcon />
                </button>
              </>
            )}
            <span className="text-sm font-medium text-gray-500">
              {moment(update.dateCreated).format("lll")}:
            </span>
            <span className="text-gray-800">{update.message}</span>
          </div>
        ))}
      </>
    );
  return <span className="text-gray-600">There are no updates yet</span>;
};

export default Updates;
