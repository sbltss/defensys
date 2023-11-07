import moment from "moment/moment";
import React, { useState } from "react";
import { ImageIcon } from "../../../../../../../Assets/Resources/Icons/Icons";
import Button from "../../../../../../UI/Button/Button";
import { Image } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { emergencyActions } from "../../../../../../../store/store";
const { cancelTicket } = emergencyActions;

const ReportItem = ({ ticket }) => {
  const dispatch = useDispatch();
  const { cancelTicketLoading } = useSelector((state) => state.emergency);
  const [imageVisible, setImageVisible] = useState(null);
  const {
    transactionNumber,
    dateCreated,
    caseTypeDesc,
    address,
    content,
    imageUrl,
    status,
    citizenNote,
  } = ticket;
  const cancelTicketHandler = () => {
    dispatch(
      cancelTicket({
        body: { reason: "TestReason" },
        params: transactionNumber,
      })
    );
  };
  return (
    <>
      <Image
        crossOrigin="same-site"
        className={"hidden"}
        preview={{
          visible: imageVisible === imageUrl,
          onVisibleChange: () => setImageVisible(null),
        }}
        src={import.meta.env.VITE_BASE_URL + "/" + imageUrl}
      />

      <div className="w-full bg-white rounded p-2 cursor-pointer flex flex-col gap-1">
        <div className="flex flex-row justify-between text-sm">
          <span>{transactionNumber}</span>
          <span>{moment(dateCreated).format("MMMM DD, YYYY")}</span>
        </div>
        <div>
          <span className="font-medium text-base">
            <span className="font-semibold">{caseTypeDesc}</span>
            {` at ${address}`}
          </span>
        </div>
        <div>
          <span>{content}</span>
        </div>
        <div className="flex flex-row justify-between items-baseline">
          <div>
            {status === -1 && (
              <span className="text-red-700 font-semibold text-sm">
                Reason: {citizenNote}
              </span>
            )}
          </div>
          <div className="flex flex-row justify-end">
            {!!imageUrl && (
              <Button
                type="primary"
                Icon={ImageIcon}
                onClick={() => setImageVisible(imageUrl)}
              />
            )}
            {status === 0 && (
              <Button
                type="danger"
                text="Cancel"
                disabled={cancelTicketLoading === transactionNumber}
                loading={cancelTicketLoading === transactionNumber}
                onClick={cancelTicketHandler}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportItem;
