import { Avatar, Drawer, Input, message } from "antd";
import { getDatabase, onValue, ref, update } from "firebase/database";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CallIncomingIcon, DropCallIcon } from "../../../../assets/icons/Icons";
import callGif from "../../../../assets/img/call/phone-call.gif";
import firebaseApp from "../../../../config/firebase";
import { callActions, resourcesActions } from "../../../../store/store";
import Button from "../../../UI/Button/Button";
const { fetchResources } = resourcesActions;
const { setOnlineListOpen, setStatus, setCallMode } = callActions;

const OnlineDrawer = ({
  callMode,
  callIncoming,
  cmsCaller,
  setCallIncoming,
  currentCall: receivedCall,
}) => {
  const videoRef = useRef(null);
  const [searchVal, setSearchVal] = useState("");
  const resources = useSelector((state) => state.resources);
  const {
    currentUser: { accountId, commandCenterId, accountType },
  } = useSelector((state) => state.auth);
  const { agentList, departmentList, responseTeamsList } = resources;
  const fbdb = getDatabase(firebaseApp);
  const peersRef = useRef(null);
  const peerConnectionsRef = useRef(null);
  const [peers, setPeers] = useState([]);
  const [agentsPeer, setAgentsPeer] = useState([]);
  const [deptsPeer, setDeptsPeer] = useState([]);
  const [rtPeer, setRtPeer] = useState([]);
  const [peerConnections, setPeerConnections] = useState([]);
  const [callerInfo, setCallerInfo] = useState(null);
  const [callingInfo, setCallingInfo] = useState(null);
  const dispatch = useDispatch();
  const { onlineListOpen, peer, status } = useSelector((state) => state.call);
  const currentStream = useRef(null);
  const currentCall = useRef(null);

  useEffect(() => {
    if (commandCenterId) {
      peersRef.current = ref(fbdb, `${commandCenterId}/peers`);
      peerConnectionsRef.current = ref(fbdb, `peerConnections/`);
    }
  }, [commandCenterId]);

  useEffect(() => {
    dispatch(
      fetchResources({
        toFetch: ["agentList", "departmentList", "responseTeamsList"],
        existing: resources,
      })
    );
  }, []);

  useEffect(() => {
    if (status === "ONLINE" && callIncoming === false) {
      dispatch(dispatch(setOnlineListOpen(false)));
    }
  }, [status, callIncoming]);

  useEffect(() => {
    let sub;
    if (callIncoming && ["AGENT", "DEPARTMENT", "RT"].includes(callMode)) {
      dispatch(dispatch(setOnlineListOpen(true)));
      if (callMode === "AGENT")
        setCallerInfo(agentList.filter((ag) => ag.accountId === cmsCaller)[0]);

      if (callMode === "DEPARTMENT")
        setCallerInfo(
          departmentList.filter((dept) => dept.accountId === cmsCaller)[0]
        );

      if (callMode === "RT")
        setCallerInfo(
          responseTeamsList.filter((rt) => rt.accountId === cmsCaller)[0]
        );

      const callerRef = ref(fbdb, `${commandCenterId}/peers/` + cmsCaller);
      sub = onValue(callerRef, async (snapshot) => {
        const data = snapshot.val();

        if (!["CALLING", "ONCALL"].includes(data.status)) {
          const selfRef = ref(fbdb, `${commandCenterId}/peers/` + accountId);
          await update(selfRef, {
            status: "ONLINE",
            type: accountType === "agent" ? "AGENT" : "DEPARTMENT",
          });
          currentStream.current?.getTracks().forEach((track) => track.stop());
          setCallIncoming(false);
          setCallerInfo(null);
          setCallingInfo(null);
          sub();
        }
      });
    }
    return () => {
      sub && sub();
    };
  }, [callIncoming, commandCenterId, callMode]);

  useEffect(() => {
    let peerConnectionsSubs;
    let peerSubs;
    if (peersRef.current) {
      peerSubs = onValue(peersRef.current, (snapshot) => {
        const data = snapshot.val();
        setPeers(data);
        // console.log(peerConnections);
        // console.log(agentList);
        // console.log(data);
        // setAgentsPeer(
        //   Object.keys(data)
        //     .filter(
        //       (key) =>
        //         data[key].type === "AGENT" &&
        //         data[key].type &&
        //         peerConnections.includes(key)
        //     )
        //     .map((d) => ({ accountId: d, status: data[d].status }))
        //     .sort((a, b) => {
        //       if (a.status === b.status) return 0;
        //       if (a.status === "ONLINE" && b.status !== "ONLINE") return -1;
        //       if (
        //         ![a.status, b.status].includes("ONLINE") &&
        //         a.status === "ONCALL" &&
        //         b.status !== "ONCALL"
        //       )
        //         return -1;
        //       if (
        //         ![a.status, b.status].includes("ONLINE") &&
        //         ![a.status, b.status].includes("ONCALL") &&
        //         a.status === "INCOMING_CALL" &&
        //         b.status !== "INCOMING_CALL"
        //       )
        //         return -1;
        //       return 1;
        //     })
        // );
      });
      peerConnectionsSubs = onValue(peerConnectionsRef.current, (snapshot) => {
        const data = snapshot.val();
        setPeerConnections(data);
      });
    }

    return () => {
      peerSubs && peerSubs();
      peerConnectionsSubs && peerConnectionsSubs();
    };
  }, [commandCenterId]);

  useEffect(() => {
    setAgentsPeer(
      Object.keys(peers)
        .filter((key) => {
          return Boolean(
            peers[key].type === "AGENT" &&
              peers[key].type &&
              (peerConnections || []).includes(key) &&
              agentList.filter((agent) => agent.accountId === key).length > 0 &&
              key != accountId
          );
        })
        .map((d) => {
          const selectedAgent = agentList.filter(
            (agent) => agent.accountId === d
          );
          if (selectedAgent[0])
            return {
              ...selectedAgent[0],
              accountId: d,
              status: peers[d].status,
            };
        })
        .sort((a, b) => {
          if (!a || !b) return 1;
          if (a.status === b.status) return 0;
          if (a.status === "ONLINE" && b.status !== "ONLINE") return -1;
          if (
            ![a.status, b.status].includes("ONLINE") &&
            a.status === "ONCALL" &&
            b.status !== "ONCALL"
          )
            return -1;
          if (
            ![a.status, b.status].includes("ONLINE") &&
            ![a.status, b.status].includes("ONCALL") &&
            a.status === "INCOMING_CALL" &&
            b.status !== "INCOMING_CALL"
          )
            return -1;
          return 1;
        })
    );

    setDeptsPeer(
      Object.keys(peers)
        .filter(
          (key) =>
            peers[key].type === "DEPARTMENT" &&
            peers[key].type &&
            (peerConnections || []).includes(key) &&
            departmentList.filter((dept) => dept.accountId === key).length >
              0 &&
            key != accountId
        )
        .map((d) => {
          const selectedDept = departmentList.filter(
            (dept) => dept.accountId === d
          );
          if (selectedDept[0])
            return {
              ...selectedDept[0],
              accountId: d,
              status: peers[d].status,
            };
        })
        .sort((a, b) => {
          if (!a || !b) return 1;
          if (a.status === b.status) return 0;
          if (a.status === "ONLINE" && b.status !== "ONLINE") return -1;
          if (
            ![a.status, b.status].includes("ONLINE") &&
            a.status === "ONCALL" &&
            b.status !== "ONCALL"
          )
            return -1;
          if (
            ![a.status, b.status].includes("ONLINE") &&
            ![a.status, b.status].includes("ONCALL") &&
            a.status === "INCOMING_CALL" &&
            b.status !== "INCOMING_CALL"
          )
            return -1;
          return 1;
        })
    );

    setRtPeer(
      Object.keys(peers)
        .filter(
          (key) =>
            peers[key].type === "RT" &&
            (peerConnections || []).includes(key) &&
            responseTeamsList.filter((rt) => rt.accountId === key).length > 0 &&
            key != accountId
        )
        .map((d) => {
          const selectedRT = responseTeamsList.filter(
            (rt) => rt.accountId === d
          );
          if (selectedRT[0])
            return {
              ...selectedRT[0],
              accountId: d,
              status: peers[d].status,
            };
        })
        .sort((a, b) => {
          if (!a || !b) return 1;
          if (a.status === b.status) return 0;
          if (a.status === "ONLINE" && b.status !== "ONLINE") return -1;
          if (
            ![a.status, b.status].includes("ONLINE") &&
            a.status === "ONCALL" &&
            b.status !== "ONCALL"
          )
            return -1;
          if (
            ![a.status, b.status].includes("ONLINE") &&
            ![a.status, b.status].includes("ONCALL") &&
            a.status === "INCOMING_CALL" &&
            b.status !== "INCOMING_CALL"
          )
            return -1;
          return 1;
        })
    );
  }, [peers, peerConnections, agentList, departmentList, responseTeamsList]);
  const callHandler = (peerId, type) => {
    dispatch(setCallMode(type));
    callMode = type;
    if (type === "AGENT")
      setCallingInfo(agentList.filter((ag) => ag.accountId === peerId)[0]);
    if (type === "DEPARTMENT")
      setCallingInfo(
        departmentList.filter((dept) => dept.accountId === peerId)[0]
      );
    if (type === "RT")
      setCallingInfo(
        responseTeamsList.filter((rt) => rt.accountId === peerId)[0]
      );

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(async (stream) => {
        currentStream.current = stream;
        stream.getVideoTracks().forEach((track) => track.stop());
        const callingRef = ref(fbdb, `${commandCenterId}/peers/` + peerId);
        const selfRef = ref(fbdb, `${commandCenterId}/peers/` + accountId);
        await update(callingRef, {
          status: "INCOMING_CALL",
          type: type,
        });
        await update(selfRef, {
          status: "CALLING",
          type: accountType === "agent" ? "AGENT" : "DEPARTMENT",
        });

        const subs = onValue(callingRef, async (snapshot) => {
          const data = snapshot.val();
          if (!["INCOMING_CALL", "ONCALL"].includes(data.status)) {
            await update(selfRef, {
              status: "ONLINE",
              type: accountType === "agent" ? "AGENT" : "DEPARTMENT",
            });
            setCallerInfo(null);
            setCallingInfo(null);
            currConn.send("END_CALL");
            dispatch(setStatus("ONLINE"));
            currentStream.current?.getTracks().forEach((track) => track.stop());
            message.info("The call has been disconnected");
            dispatch(setOnlineListOpen(false));
            subs();
          }
        });

        const currCall = peer.call(peerId, stream, {
          metadata: accountType === "agent" ? "AGENT" : "DEPARTMENT",
        });
        currentCall.current = currCall;

        currCall?.on("error", function (err) {
          console.error(err);
        });

        const currConn = peer.connect(peerId);
        currCall?.on("stream", (otherStream) => {
          if (callMode !== "RT") {
            const audio = new Audio();
            audio.srcObject = otherStream;
            audio.play();
          } else {
            videoRef.current.srcObject = otherStream;
            videoRef.current.addEventListener("loadedmetadata", () => {
              videoRef.current.play();
            });
          }
          dispatch(setStatus("ONCALL"));
        });
        currCall?.on("close", () => {
          currConn.send("END_CALL");
          dispatch(setStatus("ONLINE"));
          stream.getTracks().forEach((track) => track.stop());
          message.info("The call has been disconnected");
          dispatch(setOnlineListOpen(false));
        });
      })
      .catch((err) => {
        console.log(err);
        message.warning("Camera or Microphone permission denied");
      });
  };
  const dropCallHandler = async () => {
    if (callingInfo) {
      const callingRef = ref(
        fbdb,
        `${commandCenterId}/peers/` + callingInfo.accountId
      );
      const selfRef = ref(fbdb, `${commandCenterId}/peers/` + accountId);
      await update(callingRef, {
        status: "ONLINE",
        type: callMode,
      });
      await update(selfRef, {
        status: "ONLINE",
        type: accountType === "agent" ? "AGENT" : "DEPARTMENT",
      });
    } else {
      const callerRef = ref(
        fbdb,
        `${commandCenterId}/peers/` + callerInfo.accountId
      );
      const selfRef = ref(fbdb, `${commandCenterId}/peers/` + accountId);
      await update(callerRef, {
        status: "ONLINE",
        type: callMode,
      });
      await update(selfRef, {
        status: "ONLINE",
        type: accountType === "agent" ? "AGENT" : "DEPARTMENT",
      });
    }
    currentStream.current?.getTracks().forEach((track) => track.stop());
    setCallerInfo(null);
    setCallingInfo(null);
    dispatch(setOnlineListOpen(false));
  };

  const acceptCallHandler = async () => {
    setCallIncoming(false);
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(async (mystream) => {
        // setCallOngoing(true);
        currentStream.current = mystream;

        const selfRef = ref(fbdb, `${commandCenterId}/peers/` + accountId);
        const callerRef = ref(
          fbdb,
          `${commandCenterId}/peers/` + callerInfo.accountId
        );
        await update(selfRef, {
          status: "ONCALL",
          type: accountType === "agent" ? "AGENT" : "DEPARTMENT",
        });
        await update(callerRef, {
          status: "ONCALL",
          type: callMode,
        });
        receivedCall.current.answer(mystream);

        receivedCall.current.on("stream", (peerstream) => {
          if (callMode !== "RT") {
            const audio = new Audio();
            audio.srcObject = peerstream;
            audio.play();
          } else {
            videoRef.current.srcObject = peerstream;
            videoRef.current.addEventListener("loadedmetadata", () => {
              videoRef.current.play();
            });
          }
          const sub = onValue(selfRef, (snapshot) => {
            const data = snapshot.val();
            if (["ONLINE", "OFFLINE"].includes(data.status)) {
              setCallerInfo(null);
              setCallingInfo(null);
              mystream.getTracks().forEach((track) => track.stop());
              sub();
            }
          });
          // videoRef.current.srcObject = peerstream;
          // videoRef.current.addEventListener("loadedmetadata", () => {
          //   videoRef.current.play();
          // });
          // callerLocationSubs.current = onValue(
          //   callerLocationRef,
          //   (snapshot) => {
          //     const data = snapshot.val();
          //     if (data?.[callerId.current])
          //       setLocation(data?.[callerId.current]);
          //   }
          // );
        });
      });
  };

  return (
    <Drawer
      title={<span>Defensys Call Center</span>}
      placement="right"
      onClose={() => dispatch(setOnlineListOpen(false))}
      open={onlineListOpen}
      width={"400px"}
      className={"p-0"}
    >
      <div className="flex flex-col gap-2">
        <video
          className={`rounded-xl h-auto w-auto resize ${
            callMode !== "RT" || status !== "ONCALL" ? "hidden" : ""
          }`}
          controls
          autoPlay
          name="media"
          onClick={(e) => e.preventDefault()}
          ref={videoRef}
        ></video>
        {status === "ONCALL" && (
          <div className="flex flex-col items-center gap-2">
            {callerInfo && (
              <>
                {/* {callMode === "RT" ? (
                  <video
                    className="rounded-xl h-auto w-auto resize"
                    controls
                    autoPlay
                    name="media"
                    onClick={(e) => e.preventDefault()}
                    ref={videoRef}
                  ></video>
                ) : (
                  <Avatar size={86} className="text-4xl font-semibold">
                    {callerInfo.name
                      ? callerInfo.name[0]
                      : `${callerInfo?.firstName[0]}${callerInfo?.lastName[0]}`}
                  </Avatar>
                )} */}
                <div className="text-xl font-semibold flex flex-col justify-center items-center">
                  <span className="text-lg font-medium">CALLED BY </span>
                  <div className="flex flex-row gap-2 items-center flex-wrap text-gray-700">
                    <span className="text-lg font-semibold">
                      {callerInfo.name
                        ? callerInfo.name
                        : `${callerInfo?.firstName} ${callerInfo?.lastName}`}
                    </span>

                    {callerInfo?.contactNumber && (
                      <span className="text-lg font-medium">
                        {callerInfo?.contactNumber}
                      </span>
                    )}
                  </div>
                </div>
              </>
            )}
            {callingInfo && (
              <>
                {callMode !== "RT" && (
                  <Avatar size={86} className="text-4xl font-semibold">
                    {callingInfo.name
                      ? callingInfo.name[0]
                      : `${callingInfo?.firstName[0]}${callingInfo?.lastName[0]}`}
                  </Avatar>
                )}
                <div className="text-xl font-semibold flex flex-col justify-center items-center">
                  <span className="text-lg font-medium">CALLING </span>
                  <div className="flex flex-row gap-2 items-center flex-wrap text-gray-700">
                    <span className="text-lg font-semibold">
                      {callingInfo.name
                        ? callingInfo.name
                        : `${callingInfo?.firstName} ${callingInfo?.lastName}`}
                    </span>

                    {callingInfo?.contactNumber && (
                      <span className="text-lg font-medium">
                        {callingInfo?.contactNumber}
                      </span>
                    )}
                  </div>
                </div>
              </>
            )}

            <div className="flex flex-row mt-4">
              <Button
                text="Drop Call"
                type="danger"
                Icon={CallIncomingIcon}
                onClick={dropCallHandler}
              />
            </div>
          </div>
        )}
        {status === "CALLING" && (
          <>
            <div className="flex flex-col items-center">
              <img alt="img" src={callGif} className="w-[300px]" />
              <span className="text-xl font-semibold">
                {
                  <div className="flex flex-row gap-1 items-center text-gray-700">
                    {callingInfo && (
                      <>
                        <span className="text-lg font-medium">CALLING: </span>
                        <span className="text-lg font-semibold">
                          {callingInfo.name
                            ? callingInfo.name
                            : `${callingInfo?.firstName} ${callingInfo?.lastName}`}
                        </span>
                        {callingInfo?.mobileNumber && (
                          <span className="text-lg font-medium">
                            {" "}
                            - {callingInfo?.mobileNumber}
                          </span>
                        )}
                      </>
                    )}
                    {/* {citizenInfo?.firstName && (
                  <>
                    <span className="text-lg font-medium">SOS Call: </span>
                    <span className="text-lg font-semibold">{`${citizenInfo?.firstName} ${citizenInfo?.lastName}`}</span>
                    {citizenInfo?.mobileNumber && (
                      <span className="text-lg font-medium">
                        {" "}
                        - {citizenInfo?.mobileNumber}
                      </span>
                    )}
                  </>
                )}
                {!citizenInfo?.firstName && (
                  <span className="text-lg font-semibold">Unknown Caller</span>
                )} */}
                  </div>
                }
              </span>
              <span className="text-sm font-regular">
                The call will start as soon as accepted
              </span>
              <div className="flex flex-row mt-4">
                {status === "CALLING" && (
                  <Button
                    text="Drop Call"
                    type="danger"
                    Icon={DropCallIcon}
                    onClick={dropCallHandler}
                  />
                )}
              </div>
            </div>
          </>
        )}
        {callIncoming &&
          ["AGENT", "DEPARTMENT", "RT"].includes(callMode) &&
          status !== "CALLING" && (
            <>
              <div className="flex flex-col items-center">
                <img alt="img" src={callGif} className="w-[300px]" />
                <span className="text-xl font-semibold">
                  <div className="flex flex-row gap-1 items-center text-gray-700">
                    {callerInfo && (
                      <div className="flex flex-row flex-wrap justify-center">
                        <span className="text-lg font-medium ">
                          {`${callMode} CALL:`}
                        </span>
                        <span className="text-lg font-semibold">
                          {callerInfo.name
                            ? callerInfo.name
                            : `${callerInfo?.firstName} ${callerInfo?.lastName}`}
                        </span>
                        {callerInfo?.mobileNumber && (
                          <span className="text-lg font-medium">
                            {" "}
                            - {callerInfo?.mobileNumber}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </span>
                <span className="text-sm font-regular">
                  The call will start as soon as accepted
                </span>
                <div className="flex flex-row mt-4">
                  <Button
                    text="Accept"
                    type="primary"
                    Icon={CallIncomingIcon}
                    onClick={acceptCallHandler}
                  />
                </div>
              </div>
            </>
          )}
        {(!callIncoming || !["AGENT", "DEPARTMENT", "RT"].includes(callMode)) &&
          status !== "CALLING" &&
          status !== "ONCALL" && (
            <>
              <Input
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search dispatcher/department"
              />
              <span className="font-semibold text-zinc-700 leading-none text-lg">
                Dispatchers
              </span>
              <div className="flex flex-col gap-0">
                {agentsPeer
                  .filter((peer) => {
                    if (
                      `${peer.firstName}${peer.lastName}${peer.contactNumber}${
                        peer.status === "ONCALL" ? "ONGOING CALL" : peer.status
                      }`
                        .toLowerCase()
                        .includes(searchVal.trim().toLowerCase())
                    )
                      return true;
                    return false;
                  })
                  .map((peer) => (
                    <div
                      key={peer.accountId}
                      className={
                        peer.status === "ONLINE"
                          ? "flex flex-row justify-between items-center p-2 hover:bg-gray-200 rounded-md duration-150 cursor-pointer"
                          : "flex flex-row justify-between items-center p-2 rounded-md duration-150 cursor-not-allowed"
                      }
                      onClick={() =>
                        peer.status === "ONLINE"
                          ? callHandler(peer.accountId, "AGENT")
                          : undefined
                      }
                    >
                      <div className="flex flex-col">
                        <span>{[peer.firstName, peer.lastName].join(" ")}</span>
                        <span>{peer.contactNumber}</span>
                      </div>
                      <span
                        className={
                          peer.status === "ONLINE"
                            ? "font-semibold text-green-500"
                            : peer.status === "OFFLINE"
                            ? "font-semibold text-gray-700"
                            : "font-semibold text-yellow-500"
                        }
                      >
                        {peer.status === "ONCALL"
                          ? "ONGOING CALL"
                          : peer.status}
                      </span>
                    </div>
                  ))}
              </div>
              <span className="font-semibold text-zinc-700 leading-none text-lg">
                Departments
              </span>
              <div className="flex flex-col gap-0">
                {deptsPeer
                  .filter((peer) => {
                    if (
                      `${peer.name}${peer.contactNumber}${
                        peer.status === "ONCALL" ? "ONGOING CALL" : peer.status
                      }`
                        .toLowerCase()
                        .includes(searchVal.trim().toLowerCase())
                    )
                      return true;
                    return false;
                  })
                  .map((peer) => (
                    <div
                      key={peer.accountId}
                      className={
                        peer.status === "ONLINE"
                          ? "flex flex-row justify-between items-center p-2 hover:bg-gray-200 rounded-md duration-150 cursor-pointer"
                          : "flex flex-row justify-between items-center p-2 rounded-md duration-150 cursor-not-allowed"
                      }
                      onClick={() => callHandler(peer.accountId, "DEPARTMENT")}
                    >
                      <div className="flex flex-col">
                        <span>{peer.name}</span>
                        <span>{peer.contactNumber}</span>
                      </div>
                      <span
                        className={
                          peer.status === "ONLINE"
                            ? "font-semibold text-green-500"
                            : peer.status === "OFFLINE"
                            ? "font-semibold text-gray-700"
                            : "font-semibold text-yellow-500"
                        }
                      >
                        {peer.status === "ONCALL"
                          ? "ONGOING CALL"
                          : peer.status}
                      </span>
                    </div>
                  ))}
              </div>
              {accountType === "department" && (
                <>
                  <span className="font-semibold text-zinc-700 leading-none text-lg">
                    Response Teams
                  </span>
                  <div className="flex flex-col gap-0">
                    {rtPeer
                      .filter((peer) => {
                        if (
                          `${peer.name}${peer.contactNumber}${
                            peer.status === "ONCALL"
                              ? "ONGOING CALL"
                              : peer.status
                          }`
                            .toLowerCase()
                            .includes(searchVal.trim().toLowerCase())
                        )
                          return true;
                        return false;
                      })
                      .map((peer) => (
                        <div
                          key={peer.accountId}
                          className={
                            peer.status === "ONLINE"
                              ? "flex flex-row justify-between items-center p-2 hover:bg-gray-200 rounded-md duration-150 cursor-pointer"
                              : "flex flex-row justify-between items-center p-2 rounded-md duration-150 cursor-not-allowed"
                          }
                          onClick={() => callHandler(peer.accountId, "RT")}
                        >
                          <div className="flex flex-col">
                            <span>
                              {[
                                peer.firstName,
                                peer.lastName,
                                `(${peer.type})`,
                              ].join(" ")}
                            </span>
                            <span>{peer.contactNumber}</span>
                          </div>
                          <span
                            className={
                              peer.status === "ONLINE"
                                ? "font-semibold text-green-500"
                                : peer.status === "OFFLINE"
                                ? "font-semibold text-gray-700"
                                : "font-semibold text-yellow-500"
                            }
                          >
                            {peer.status === "ONCALL"
                              ? "ONGOING CALL"
                              : peer.status}
                          </span>
                        </div>
                      ))}
                  </div>
                </>
              )}
            </>
          )}
      </div>
    </Drawer>
  );
};

export default OnlineDrawer;
