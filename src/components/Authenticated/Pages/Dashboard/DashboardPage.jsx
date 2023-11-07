import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { MaximizeIcon, MinimizeIcon } from "../../../../assets/icons/Icons";
import { dashboardActions, resourcesActions } from "../../../../store/store";
import { lazy } from "react";
import Stream from "./contents/Stream/Stream";
const Earthquake = lazy(() => import("./contents/Earthquake/Earthquake"));
const Komunidad = lazy(() => import("./contents/Komunidad/Komunidad"));
const SosEmergency = lazy(() => import("./contents/SosEmergency/SosEmergency"));
const Weather = lazy(() => import("./contents/Weather/Weather"));
const { fetchResources } = resourcesActions;

const { setExpand } = dashboardActions;

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { expanded } = useSelector((state) => state.dashboard);
  const { currentUser } = useSelector((state) => state.auth);
  const resources = useSelector((state) => state.resources);
  useEffect(() => {
    dispatch(
      fetchResources({
        existing: resources,
        toFetch: ["caseTypes"],
      })
    );
  }, []);
  return (
    <>
      <Helmet>
        <title>Defensys | Dashboard</title>
      </Helmet>
      <div
        className={
          !expanded
            ? "grid lg:grid-cols-2 xl:grid-cols-3 gap-4 gap-y-0"
            : undefined
        }
      >
        <div
          className={
            expanded
              ? expanded !== "sos"
                ? "hidden"
                : "col-span-2 row-span-1 mb-4 xl:mb-0 xl:col-span-1 xl:row-span-2"
              : "col-span-2 row-span-1 mb-4 xl:mb-0 xl:col-span-1 xl:row-span-2"
          }
        >
          <Card
            type="sos"
            // title={"SOS Emergency Dispatch & Response Monitoring"}
          >
            <SosEmergency />
          </Card>
        </div>
        <div className={!expanded ? "col-span-2" : undefined}>
          <div
            className={
              !expanded
                ? "grid grid-flow-row grid-rows-2 grid-cols-2 gap-4"
                : undefined
            }
          >
            <div
              className={
                expanded
                  ? expanded !== "weather"
                    ? "hidden"
                    : "col-span-2 row-span-1"
                  : "col-span-2 row-span-1"
              }
            >
              <Card type="weather" title={""}>
                <Weather expanded={expanded} />
              </Card>
            </div>
            {/* <div
              className={
                expanded
                  ? expanded !== "cctv"
                    ? "hidden"
                    : "col-span-2 lg:col-span-1 lg:row-span-1"
                  : "col-span-2 lg:col-span-1 lg:row-span-1"
              }
            >
              <Card type="cctv" title={"Localized Weather Monitoring"}>
                <Komunidad />
              </Card>
            </div> */}

            <div
              className={
                expanded
                  ? expanded !== "cctv"
                    ? "hidden"
                    : "col-span-2 lg:col-span-1 lg:row-span-1"
                  : "col-span-2 lg:col-span-1 lg:row-span-1"
              }
            >
              <Card type="cctv" title={"Live Streaming"}>
                <Stream />
                {/* <WeatherDotCom /> */}
              </Card>
            </div>
            {/* {["admin", "agent"].includes(currentUser.accountType) && (
              <div
                className={
                  expanded
                    ? expanded !== "cctv"
                      ? "hidden"
                      : "col-span-1 row-span-1"
                    : "col-span-1 row-span-1"
                }
              >
                <Card type="cctv" title={"CCTV Monitoring"}>
                  <CCTV />
                </Card>
              </div>
            )} */}
            <div
              className={
                expanded
                  ? expanded !== "usher"
                    ? "hidden"
                    : "col-span-2 lg:col-span-1 lg:row-span-1"
                  : // : ["admin", "agent"].includes(currentUser.accountType)
                  true
                  ? "col-span-2 lg:col-span-1 lg:row-span-1"
                  : "col-span-2 row-span-1"
              }
            >
              <Card type="usher" title={"Earthquake Monitoring"}>
                <Earthquake expanded={expanded} />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Card = ({ children, title, type }) => {
  const dispatch = useDispatch();
  const { expanded } = useSelector((state) => state.dashboard);

  return (
    <div
      className={
        type === "sos" || expanded === type
          ? "bg-white rounded shadow p-2 flex flex-col xl:h-[calc(100vh-100px)]"
          : "bg-white rounded shadow p-2 flex flex-col h-[calc(50vh-60px)]"
        // ? "bg-white rounded shadow p-2 flex flex-col xl:h-[calc(100vh-100px)] lg: h-[calc(50vh-60px)]"
        // : "bg-white rounded shadow p-2 flex flex-col h-[calc(50vh-60px)]"
      }
    >
      <div className="flex flex-row justify-between items-start">
        {type !== "weather" && (
          <span className="text-lg font-semibold">{title}</span>
        )}
        {type !== "sos" && type !== "weather" && (
          <button
            className="hover:bg-gray-200 p-1 rounded duration-200"
            onClick={() => dispatch(setExpand(expanded ? null : type))}
          >
            {expanded && <MinimizeIcon />}
            {!expanded && <MaximizeIcon />}
          </button>
        )}
      </div>
      {children}
    </div>
  );
};

export default DashboardPage;
