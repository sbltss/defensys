import React from "react";
import { useDispatch } from "react-redux";
import { CloseIcon } from "../../../assets/icons/Icons";
import { chatActions, ticketsActions } from "../../../store/store";
import Button from "../../UI/Button/Button";
import { useLocation, useNavigate } from "react-router-dom";

const { deselectChatTicket } = chatActions;

const Header = ({ selectedChatTicket }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { firstName, lastName, transactionNumber } = selectedChatTicket;
  const { selectAcceptedTicket, setSelectedTab } = ticketsActions;

  const deselectChatTicketHandler = () => {
    dispatch(deselectChatTicket());
  };

  const openTicketHandler = () => {
    if (location.pathname !== "/emergencyTickets") {
      navigate("/emergencyTickets");
    }
    dispatch(setSelectedTab("accepted"));
    dispatch(selectAcceptedTicket(selectedChatTicket));
  };

  return (
    <div className="text-white border-b-2 flex flex-row justify-between items-center px-2 py-1 bg-primary-700 rounded-t-lg">
      <div className="flex flex-col">
        <span>{`${firstName} ${lastName}`}</span>
        <span
          onClick={openTicketHandler}
          className="text-sm cursor-pointer hover:scale-105 duration-150"
        >
          {transactionNumber}
        </span>
      </div>
      <div className="flex flex-row gap-0">
        <Button
          onClick={deselectChatTicketHandler}
          Icon={CloseIcon}
          type="icon"
        />
        {/* <span>+</span> */}
        {/* <span>x</span> */}
      </div>
    </div>
  );
};

export default Header;
