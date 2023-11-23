import { Modal, message } from "antd";
import { get, getDatabase, onValue, ref, set, update } from "firebase/database";
import moment from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { useDispatch, useSelector } from "react-redux";
import ringtone from "../../../assets/audio/incoming_call.wav";
import {
  CallIncomingIcon,
  DropCallIcon,
  MutedIcon,
  TicketOutlineIcon,
  UnmutedIcon,
} from "../../../assets/icons/Icons";
import callGif from "../../../assets/img/call/phone-call.gif";
import firebaseApp from "../../../config/firebase";
import Peer from "../../../config/peer";
import { callActions } from "../../../store/store";
import Button from "../../UI/Button/Button";
import CreateReport from "../Reusable/Drawer/CreateReport";
import OnlineDrawer from "./OnlineAccounts/OnlineDrawer";
import MultiStreamsMixer from "multistreamsmixer";
import RecordRTC, { getSeekableBlob, MultiStreamRecorder } from "recordrtc";
import { saveAs } from "file-saver";

const {
  setStatus,
  setPeerStatus,
  addCallLog,
  fetchCitizenInfo,
  setPeer,
  setCallMode,
  setCitizenInfo,
  setOnlineListOpen,
} = callActions;
const ringToneAudio = new Audio(ringtone);
const Call = () => {
  const [rtCallerInfo, setRtCallerInfo] = useState(null);
  const { currentUser } = useSelector((state) => state.auth);
  const { responseTeamsList } = useSelector((state) => state.resources);
  const [callOngoing, setCallOngoing] = useState(false);
  const [muted, setMuted] = useState(false);
  const [cmsCaller, setCmsCaller] = useState(null);
  const [callIncoming, setCallIncoming] = useState(false);
  const [mode, setMode] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState(null);
  const videoRef = useRef(null);
  const dispatch = useDispatch();
  const { peerStatus, citizenInfo, fetchCitizenInfoLoading, callMode } =
    useSelector((state) => state.call);
  const fbdb = getDatabase(firebaseApp);
  const peerClientsRef = useRef(null);
  const peerOngoingCallsRef = useRef(null);
  const peerQueueingRef = useRef(null);
  const callerLocationRef = useRef(null);

  const citizenInfoRef = useRef(null);
  const rtInfoRef = useRef(null);
  useEffect(() => {
    if (citizenInfo?.firstName) {
      citizenInfoRef.current = citizenInfo;
    } else {
      setRtCallerInfo(
        responseTeamsList.filter((rt) => rt.accountId === cmsCaller)[0]
      );
      rtInfoRef.current = responseTeamsList.filter(
        (rt) => rt.accountId === cmsCaller
      )[0];
    }
  }, [citizenInfo]);

  useEffect(() => {
    callModeRef.current = callMode;
  }, [callMode]);

  const incomingCallSubs = useRef(null);
  const callerId = useRef(null);
  const callStart = useRef(null);
  const callEnd = useRef(null);
  const currentCall = useRef(null);
  const currentStream = useRef(null);
  const currentConn = useRef(null);
  const ringtoneInterval = useRef(null);
  const callModeRef = useRef(null);
  const callerLocationSubs = useRef(null);
  const peerRef = useRef(null);

  const mixAV = useRef(null);

  const peerAssignmentsRef = useRef(null);
  peerAssignmentsRef.current = ref(fbdb, `peerAssignments/`);

  useEffect(() => {
    if (currentUser.commandCenterId) {
      peerClientsRef.current = ref(
        fbdb,
        `${currentUser.commandCenterId}/peers/` + currentUser.accountId
      );
      peerOngoingCallsRef.current = ref(
        fbdb,
        `${currentUser.commandCenterId}/peerOngoingCalls/`
      );
      peerQueueingRef.current = ref(
        fbdb,
        `${currentUser.commandCenterId}/peerQueue/`
      );
      callerLocationRef.current = ref(
        fbdb,
        `${currentUser.commandCenterId}/callerLocation`
      );
    }
    return () => {
      // if (peerRef.current) peerRef.current?.destroy();
    };
  }, [currentUser]);

  const acceptCallHandler = async () => {
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then(async (mystream) => {
        setCallOngoing(true);
        setMuted(false);
        currentStream.current = mystream;
        await update(peerOngoingCallsRef.current, {
          [callerId.current]: currentUser.accountId,
        });
        await get(peerQueueingRef.current).then(async (snapshot) => {
          let val = snapshot.val();
          let newVal;
          let newValObj = {};
          if (Array.isArray(val)) {
            newVal = val.filter((v) => {
              return v != callerId.current;
            });
            newVal.forEach((v, index) => {
              newValObj[index] = v;
            });

            if (Object.keys(newValObj).length == 0) {
              await set(peerQueueingRef.current, newValObj);
            } else {
              await set(peerQueueingRef.current, newValObj);
            }
          }
        });
        callStart.current = moment();

        await update(peerClientsRef.current, {
          status: "ONCALL",
          type: currentUser.accountType === "agent" ? "AGENT" : "DEPARTMENT",
        });
        setCallIncoming(false);
        currentCall.current.answer(mystream);

        currentCall.current.on("stream", (peerstream) => {
          mixAV.current = new MultiStreamRecorder([mystream, peerstream], {
            mimeType: "video/mp4",
            video: {
              height: 1280,
              width: 720,
            },
          });
          mixAV.current.record();

          videoRef.current.srcObject = peerstream;
          videoRef.current.addEventListener("loadedmetadata", () => {
            videoRef.current.play();
          });
          callerLocationSubs.current = onValue(
            callerLocationRef.current,
            (snapshot) => {
              const data = snapshot.val();
              if (data?.[callerId.current])
                setLocation(data?.[callerId.current]);
            }
          );
        });
      })
      .catch((err) => {
        console.log(err);
        currentStream.current.getTracks().forEach((track) => track.stop());
      });
  };

  const dropCallHandler = async () => {
    mixAV.current.stop(function (blob) {
      getSeekableBlob(blob, function (seekableBlob) {
        if (citizenInfoRef?.current?.firstName) {
          saveAs(
            seekableBlob,
            moment().format("YYYY-MM-DD HH:mm:ss") +
              ` - ${citizenInfoRef.current.firstName[0]}. ${citizenInfoRef.current.lastName} (${citizenInfoRef.current.accountId}) - ${currentUser.firstName[0]}. ${currentUser.lastName} (${currentUser.accountId})` +
              ".mp4"
          );
        } else if (rtInfoRef.current?.firstName) {
          saveAs(
            seekableBlob,
            moment().format("YYYY-MM-DD HH:mm:ss") +
              ` - ${rtInfoRef.current.firstName[0]}. ${rtInfoRef.current.lastName} (${rtInfoRef.current.accountId}) - ${currentUser.firstName[0]}. ${currentUser.lastName} (${currentUser.accountId})` +
              ".mp4"
          );
        } else {
          saveAs(
            seekableBlob,
            moment().format("YYYY-MM-DD HH:mm:ss") +
              ` - Unknown Caller - ${currentUser.firstName[0]}. ${currentUser.lastName} (${currentUser.accountId})` +
              ".mp4"
          );
        }
      });
    });
    callEnd.current = moment();
    let duration = moment.duration(callEnd.current.diff(callStart.current));
    duration = `${duration.hours().toFixed(0)}:${duration
      .minutes()
      .toFixed(0)}:${duration.seconds().toFixed(0)}`;
    if (callStart.current) {
      dispatch(
        addCallLog({
          callFrom: callerId.current,
          callTo: currentUser.accountId,
          start: callStart.current.format("YYYY-MM-DD HH:mm:ss"),
          end: callEnd.current.format("YYYY-MM-DD HH:mm:ss"),
          duration,
        })
      );
      // await addCallRecord({
      //   callFrom: callerId,
      //   callTo: currentUser.accountId,
      //   start: callStart.current.format("YYYY-MM-DD HH:mm:ss"),
      //   end: callEnd.current.format("YYYY-MM-DD HH:mm:ss"),
      //   duration,
      // });
    }
    callStart.current = null;
    callEnd.current = null;

    currentConn.current?.send("END_CALL");
    currentConn.current?.close();
    currentConn.current = null;
    currentCall.current = null;
    await currentCall.current?.close();
    currentStream.current?.getTracks().forEach((track) => track.stop());
    await get(peerOngoingCallsRef.current).then((snapshot) => {
      let val = snapshot.val();
      if (val[callerId.current]) {
        delete val[callerId.current];
      }
      set(peerOngoingCallsRef.current, val);
    });

    callerId.current = null;
    await update(peerClientsRef.current, {
      status: "PROCESSING",
      type: currentUser.accountType === "agent" ? "AGENT" : "DEPARTMENT",
    });
    setCallOngoing(false);
    dispatch(setOnlineListOpen(false))
    message.warning("You have been disconnected to the caller.");
    if (callerLocationSubs.current) callerLocationSubs.current();
    setMode("create");
  };

  useEffect(() => {
    if (["AGENT", "DEPARTMENT", "RT"].includes(callModeRef.current)) {
      if (callIncoming) {
        ringToneAudio.play();
        ringtoneInterval.current = setInterval(() => {
          ringToneAudio.pause();
          ringToneAudio.currentTime = 0;
          ringToneAudio.play();
        }, 11000);
      } else {
        ringToneAudio.pause();
        ringToneAudio.currentTime = 0;
        clearInterval(ringtoneInterval.current);
      }
    } else {
      if (incomingCallSubs.current) incomingCallSubs.current();
      if (callIncoming) {
        dispatch(fetchCitizenInfo({ accountId: callerId.current }));

        ringToneAudio.play();
        ringtoneInterval.current = setInterval(() => {
          ringToneAudio.pause();
          ringToneAudio.currentTime = 0;
          ringToneAudio.play();
        }, 11000);
        incomingCallSubs.current = onValue(
          peerQueueingRef.current,
          (snapshot) => {
            const data = snapshot.val();
            if (!data?.includes(callerId.current) && callIncoming) {
              get(peerOngoingCallsRef.current).then(async (snapshot) => {
                let val = snapshot.val();
                if (val?.[callerId.current] !== currentUser.accountId) {
                  await get(peerClientsRef.current).then(async (snapshot) => {
                    let val = snapshot.val();
                    if (val.status !== "ONLINE") {
                      update(peerClientsRef.current, {
                        status: "ONLINE",
                        type:
                          currentUser.accountType === "agent"
                            ? "AGENT"
                            : "DEPARTMENT",
                      });
                      message.warning(
                        "Call dropped or transferred to another agent"
                      );
                    }
                  });
                  if (incomingCallSubs.current) incomingCallSubs.current();
                  ringToneAudio.pause();
                  ringToneAudio.currentTime = 0;
                  clearInterval(ringtoneInterval.current);
                }
              });
            }
          }
        );
      } else {
        ringToneAudio.pause();
        ringToneAudio.currentTime = 0;
        clearInterval(ringtoneInterval.current);
      }
    }
  }, [callIncoming]);
  useEffect(() => {
    if (peerStatus === "reconnecting" && currentUser?.commandCenterId) {
      try {
        navigator.mediaDevices
          .getUserMedia({ video: false, audio: true })
          .then((stream) => {
            stream.getTracks().forEach((track) => track.stop());
            if (peerStatus === "reconnecting") {
              const peer = Peer(currentUser.accountId);
              peerRef.current = peer;
              get(peerAssignmentsRef.current).then(async (snapshot) => {
                let val = snapshot.val() || {};
                if (!val[currentUser.accountId])
                  val[currentUser.accountId] = currentUser.commandCenterId;
                else if (
                  val[currentUser.accountId] !== currentUser.commandCenterId
                )
                  val[currentUser.accountId] = currentUser.commandCenterId;

                set(peerAssignmentsRef.current, val);
              });
              onValue(peerClientsRef.current, (snapshot) => {
                const data = snapshot.val();
                if (callerId.current) {
                  if (data.status === "ONLINE") {
                    callerId.current = null;
                    currentStream.current = null;
                    currentCall.current = null;
                    setCallIncoming(false);
                    // clearInterval(RINGTONE_INTERVAL);
                    // RINGTONE_INTERVAL = null;
                    // ringToneAudio.pause();
                    // ringToneAudio.currentTime = 0;
                    // Swal.close();
                  } else if (data.status === "PROCESSING") {
                    // clearInterval(RINGTONE_INTERVAL);
                    // RINGTONE_INTERVAL = null;
                    // ringToneAudio.pause();
                    // ringToneAudio.currentTime = 0;
                    // Swal.close();
                  }
                }
              });

              onValue(peerOngoingCallsRef.current, async (snapshot) => {
                const data = snapshot.val();
                if (callerId.current) {
                  if (!data || !data[callerId.current]) {
                    if (callStart.current) {
                      mixAV.current.stop(function (blob) {
                        getSeekableBlob(blob, function (seekableBlob) {
                          if (citizenInfoRef?.current?.firstName) {
                            saveAs(
                              seekableBlob,
                              moment().format("YYYY-MM-DD HH:mm:ss") +
                                ` - ${citizenInfoRef.current.firstName[0]}. ${citizenInfoRef.current.lastName} (${citizenInfoRef.current.accountId}) - ${currentUser.firstName[0]}. ${currentUser.lastName} (${currentUser.accountId})` +
                                ".mp4"
                            );
                          } else if (rtInfoRef.current?.firstName) {
                            saveAs(
                              seekableBlob,
                              moment().format("YYYY-MM-DD HH:mm:ss") +
                                ` - ${rtInfoRef.current.firstName[0]}. ${rtInfoRef.current.lastName} (${rtInfoRef.current.accountId}) - ${currentUser.firstName[0]}. ${currentUser.lastName} (${currentUser.accountId})` +
                                ".mp4"
                            );
                          } else {
                            saveAs(
                              seekableBlob,
                              moment().format("YYYY-MM-DD HH:mm:ss") +
                                ` - Unknown Caller - ${currentUser.firstName[0]}. ${currentUser.lastName} (${currentUser.accountId})` +
                                ".mp4"
                            );
                          }
                        });
                      });
                      callEnd.current = moment();
                      let duration = moment.duration(
                        callEnd.current.diff(callStart)
                      );
                      duration = `${duration.hours().toFixed(0)}:${duration
                        .minutes()
                        .toFixed(0)}:${duration.seconds().toFixed(0)}`;
                      dispatch(
                        addCallLog({
                          callFrom: callerId.current,
                          callTo: currentUser.accountId,
                          start: callStart.current.format(
                            "YYYY-MM-DD HH:mm:ss"
                          ),
                          end: callEnd.current.format("YYYY-MM-DD HH:mm:ss"),
                          duration,
                        })
                      );
                      callStart.current = null;
                      callEnd.current = null;

                      await update(peerClientsRef.current, {
                        status: "PROCESSING",
                        type:
                          currentUser.accountType === "agent"
                            ? "AGENT"
                            : "DEPARTMENT",
                      });
                      currentCall.current.close();
                      currentCall.current = null;
                      currentStream.current
                        ?.getTracks()
                        .forEach((track) => track.stop());
                      currentConn.current.close();
                      currentConn.current = null;
                      setCallOngoing(false);
                      message.warning(
                        "You have been disconnected to the caller."
                      );
                      if (callerLocationSubs.current)
                        callerLocationSubs.current();
                      setMode("create");
                      // Swal.fire(
                      //   "Call dropped",
                      //   "You have been disconnected to the caller. Press the processing button if you are ready to receive your next call.",
                      //   "info"
                      // );
                    }
                  }
                }
              });

              peer.on("open", (id) => {
                console.log("Connected to peer server with id: " + id);
                message.success("Ready to receive calls");
                update(peerClientsRef.current, {
                  status: "ONLINE",
                  type:
                    currentUser.accountType === "agent"
                      ? "AGENT"
                      : "DEPARTMENT",
                });
                dispatch(setPeerStatus("connected"));
                onValue(peerClientsRef.current, (snapshot) => {
                  const data = snapshot.val();
                  dispatch(setStatus(data.status));
                });
                dispatch(setPeer(peer));
              });
              peer.on("error", (err) => {
                dispatch(setPeerStatus("disconnected"));
                if (err.type == "unavailable-id") {
                  message.error(
                    "Cannot receive call. Account is active in a different device or tab."
                  );
                  dispatch(setStatus("ERROR"));
                } else if (err.type == "network") {
                  message.error(
                    "Cannot receive call. Cannot connect to peers server. Contact support."
                  );
                  dispatch(setStatus("ERROR"));
                }
              });
              peer.on("connection", (conn) => {
                currentConn.current = conn;
              });
              peer.on("call", (call) => {
                setCmsCaller(call.peer);
                callModeRef.current = call.metadata;
                dispatch(setCallMode(call.metadata));
                callerId.current = call.peer;
                currentCall.current = call;
                setCallIncoming(true);
                call.on("error", (err) => {
                  console.log(err);
                });
                call.on("close", (data) => {
                  console.log(data);
                });
              });
            }
          });
      } catch (err) {
        message.warning("Call functionality not supported");
        dispatch(setPeerStatus("disconnected"));
        dispatch(setStatus("ERROR"));
      }
    }
  }, [peerStatus, currentUser?.commandCenterId]);

  const toggleMute = () => {
    if (muted) {
      currentStream.current
        .getAudioTracks()
        .forEach((track) => (track.enabled = true));
    } else {
      currentStream.current
        .getAudioTracks()
        .forEach((track) => (track.enabled = false));
    }
    setMuted(!muted);
  };

  return (
    <>
      <OnlineDrawer
        callMode={callModeRef.current}
        callIncoming={callIncoming}
        cmsCaller={cmsCaller}
        setCallIncoming={setCallIncoming}
        currentCall={currentCall}
      />
      <CreateReport
        citizenInfo={citizenInfo}
        rtCallerInfo={rtCallerInfo}
        fetchCitizenInfoLoading={fetchCitizenInfoLoading}
        visible={mode === "create"}
        setMode={setMode}
        locationName={locationName}
        setLocationName={setLocationName}
        location={location}
        setLocation={setLocation}
      />
      <Modal
        open={
          callIncoming &&
          !["AGENT", "DEPARTMENT", "RT"].includes(callModeRef.current)
        }
        closable={false}
        footer={null}
      >
        <div className="flex flex-col items-center">
          <img alt="img" src={callGif} className="w-[300px]" />
          <span className="text-xl font-semibold">
            {
              <div className="flex flex-row gap-1 items-center text-gray-700">
                {citizenInfo?.firstName && (
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
                {!citizenInfo?.firstName && !rtCallerInfo?.firstName && (
                  <span className="text-lg font-semibold">Unknown Caller</span>
                )}
                {rtCallerInfo?.firstName && (
                  <>
                    <span className="text-lg font-medium">SOS Call: </span>
                    <span className="text-lg font-semibold">{`${rtCallerInfo?.firstName} ${rtCallerInfo?.lastName}`}</span>
                    {rtCallerInfo?.contactNumber && (
                      <span className="text-lg font-medium">
                        {" "}
                        - {rtCallerInfo?.contactNumber}
                      </span>
                    )}
                  </>
                )}
              </div>
            }
          </span>
          <span className="text-sm font-regular">
            The call will start as soon as you accept
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
      </Modal>
      <Draggable>
        <div
          className="flex flex-col absolute top-5 right-5 gap-1 z-[1001]  max-h-96 max-w-sm"
          style={{ visibility: callOngoing ? "visible" : "hidden" }}
        >
          <video
            className="rounded-xl h-auto w-auto resize"
            controls
            autoPlay
            name="media"
            onClick={(e) => e.preventDefault()}
            ref={videoRef}
          ></video>
          <div className="flex flex-row gap-2 justify-between z-50">
            {mode !== "create" && (
              <Button
                text={"Report With Location"}
                type="primary"
                Icon={TicketOutlineIcon}
                loading={!location}
                disabled={!location}
                onClick={() => setMode("create")}
              />
            )}
            <Button
              type="muted"
              Icon={muted ? MutedIcon : UnmutedIcon}
              onClick={toggleMute}
            />
            <Button
              type="danger"
              Icon={DropCallIcon}
              onClick={dropCallHandler}
            />
          </div>
        </div>
      </Draggable>
    </>
  );
};

export default Call;
