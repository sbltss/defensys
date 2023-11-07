import React from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { MaximizeIcon, MinimizeIcon } from "../../../../assets/icons/Icons";
import { dashboardActions } from "../../../../store/store";
import CCTV from "./contents/CCTV/CCTV";
import Earthquake from "./contents/Earthquake/Earthquake";
import SosEmergency from "./contents/SosEmergency/SosEmergency";
import Weather from "./contents/Weather/Weather";

const { setExpand } = dashboardActions;

const DashboardPage = () => {
  const { expanded } = useSelector((state) => state.dashboard);
  return (
    <>
      <Helmet>
        <title>Defensys | Dashboard</title>
      </Helmet>
      <div className={!expanded ? "grid grid-cols-3 gap-4 gap-y-0" : undefined}>
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
            <div
              className={
                expanded
                  ? expanded !== "usher"
                    ? "hidden"
                    : "col-span-1 row-span-1"
                  : "col-span-1 row-span-1"
              }
            >
              <Card type="usher" title={"Earthquake Monitoring"}>
                <Earthquake expanded={expanded} />
              </Card>
            </div>
            <div
              className={
                expanded
                  ? expanded !== "weather"
                    ? "hidden"
                    : "col-span-2 row-span-1"
                  : "col-span-2 row-span-1"
              }
            >
              <Card type="weather" title={"Weather Monitoring"}>
                <Weather expanded={expanded} />
              </Card>
            </div>
          </div>
        </div>
        <div
          className={
            expanded
              ? expanded !== "sos"
                ? "hidden"
                : "row-span-2"
              : "row-span-2"
          }
        >
          <Card
            type="sos"
            title={"SOS Emergency Dispatch & Response Monitoring"}
          >
            <SosEmergency />
          </Card>
        </div>
      </div>
    </>
  );
};

const Card = ({ children, title, type }) => {
  const dispatch = useDispatch();
  const { expanded } = useSelector((state) => state.dashboard);

  return (
    <div className={"bg-white rounded shadow p-4 flex flex-col h-full"}>
      <div className="flex flex-row justify-between items-start">
        <span className="text-lg font-semibold">{title}</span>
        {type !== "sos" && (
          <button
            className="hover:bg-gray-200 p-3 pt-2 rounded duration-200"
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
