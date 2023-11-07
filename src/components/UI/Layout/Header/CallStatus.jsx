import React, { useEffect, useRef } from "react";
import Button from "../../Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { ref, getDatabase, update } from "firebase/database";
import firebaseApp from "../../../../config/firebase";
import { callActions } from "../../../../store/store";
import { UsersIcon } from "../../../../assets/icons/Icons";
const { setStatus, setPeerStatus, setOnlineListOpen } = callActions;

const CallStatus = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const { status, peerStatus, callMode } = useSelector((state) => state.call);
  const fbdb = getDatabase(firebaseApp);
  const agentPeerRef = useRef();
  const toggleStatus = async () => {
    dispatch(setStatus("LOADING"));
    let newStatus = status === "ONLINE" ? "OFFLINE" : "ONLINE";
    await update(agentPeerRef.current, {
      status: newStatus,
      type: currentUser.accountType === "agent" ? "AGENT" : "DEPARTMENT",
    });
  };
  const setRetryHandler = () => {
    dispatch(setPeerStatus("reconnecting"));
  };

  useEffect(() => {
    if (currentUser.commandCenterId) {
      agentPeerRef.current = ref(
        fbdb,
        `${currentUser.commandCenterId}/peers/` + currentUser.accountId
      );
    }
  }, [currentUser]);

  return (
    <>
      <Button
        type={
          status === "ONLINE" || status === "ONCALL"
            ? "success"
            : status === "OFFLINE" || peerStatus === "reconnecting"
            ? "muted"
            : status === "LOADING"
            ? "warning"
            : status === "ERROR" || peerStatus === "disconnected"
            ? "danger"
            : status === "PROCESSING"
            ? "warning"
            : ""
        }
        text={
          peerStatus === "reconnecting"
            ? "Connecting"
            : status === "ONLINE"
            ? "ONLINE"
            : status === "OFFLINE"
            ? "OFFLINE"
            : status === "ONCALL"
            ? "ONCALL"
            : status === "PROCESSING"
            ? "PROCESSING"
            : status === "ERROR"
            ? "CANNOT RECEIVE CALL"
            : ""
        }
        onClick={
          status === "ERROR"
            ? setRetryHandler
            : status === "ONCALL" || peerStatus === "reconnecting"
            ? undefined
            : toggleStatus
        }
      />
      {status === "ONLINE" && (
        <Button
          type={"muted"}
          Icon={UsersIcon}
          onClick={() => dispatch(setOnlineListOpen(true))}
        />
      )}
      {status === "ONCALL" &&
        ["AGENT", "DEPARTMENT", "RT"].includes(callMode) && (
          <div className="animate-pulse">
            <Button
              text="Call ongoing"
              type={"warning"}
              onClick={() => dispatch(setOnlineListOpen(true))}
            />
          </div>
        )}
    </>
  );
};

export default CallStatus;
