import { useEffect, useRef } from "react";
import { authActions } from "../store/store";
import { useDispatch } from "react-redux";
import { message } from "antd";
import moment from "moment";
import { useState } from "react";
import PageLoader from "../components/UI/Layout/PageLoader";

const { logout } = authActions;

const events = [
  "load",
  "mousemove",
  "mousedown",
  "click",
  "scroll",
  "keypress",
];

const UseUpdateActivity = ({ children }) => {
  const [sessionValid, setSessionValid] = useState(false);
  const lastSavedActivity = useRef();
  const dispatch = useDispatch();
  let timer;

  const handleLogoutTimer = () => {
    timer = setTimeout(() => {
      resetTimer();
      Object.values(events).forEach((item) => {
        window.removeEventListener(item, resetTimer);
      });
      logoutAction();
    }, 43200000);
  };

  const resetTimer = () => {
    if (timer) clearTimeout(timer);
  };

  const handleUpdateLocalStorage = () => {
    if (
      !lastSavedActivity.current ||
      moment().diff(
        moment(lastSavedActivity.current, "YYYY-MM-DD HH:mm:ss"),
        "seconds"
      ) > 5
    ) {
      lastSavedActivity.current = moment().format("YYYY-MM-DD HH:mm:ss");
      localStorage.setItem("lastActvity", lastSavedActivity.current);
    }
  };

  const logoutAction = () => {
    setSessionValid(false);
    dispatch(logout());
    message.info("Signed out due to inactivity");
  };

  useEffect(() => {
    lastSavedActivity.current = localStorage.getItem("lastActvity");
    if (
      lastSavedActivity.current &&
      moment().diff(
        moment(lastSavedActivity.current, "YYYY-MM-DD HH:mm:ss"),
        "hours"
      ) > 12
    ) {
      logoutAction();
    } else {
      setSessionValid(true);
      Object.values(events).forEach((item) => {
        window.addEventListener(item, () => {
          resetTimer();
          handleLogoutTimer();
          handleUpdateLocalStorage();
        });
      });
    }
    return resetTimer;
  }, []);

  if (sessionValid) return <>{children} </>;
  else return <PageLoader />;
};

export default UseUpdateActivity;
