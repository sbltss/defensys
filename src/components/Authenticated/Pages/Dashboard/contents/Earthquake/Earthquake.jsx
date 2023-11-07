import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import usherMarker from "../../../../../../assets/img/map/usher.gif";
import { getUniqueUsherBldg } from "../../../../../../helpers";
import { usherActions } from "../../../../../../store/store";

let mounted = true;
const { fetchEvents } = usherActions;

const intensityColorMap = {
  1: "#fff",
  2: "#DFE6FE",
  3: "#DFE6FE",
  4: "#7EFBDF",
  5: "#95F879",
  6: "#F7F835",
  7: "#FDCA2C",
  8: "#FF701F",
  9: "#EC2516",
  10: "#C81E11",
};
const Earthquake = ({ expanded }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { accessToken, events, fetchEventsLoading } = useSelector(
    (state) => state.usher
  );
  useEffect(() => {
    if (location.pathname === "/dashboard") {
      mounted = true;
      dispatch(fetchEvents(accessToken));
      const fetchInterval = setInterval(() => {
        if (mounted) {
          dispatch(fetchEvents(accessToken));
        }
      }, 600000);

      return () => {
        mounted = false;
        clearInterval(fetchInterval);
      };
    }
  }, [location]);

  const [map, setMap] = useState(null);

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const defaultProps = {
    center: {
      lat: 12.433103851530154,
      lng: 122.11480841586567,
    },
    zoom: 6,
    mapId: "15f9baeb3890ce9f",
  };
  return (
    <div
      className={
        expanded === "usher" ? "h-full grid grid-cols-3 h-54" : undefined
      }
    >
      <div className={expanded === "usher" ? "col-span-1" : undefined}>
        <span className="text-gray-500 font-medium">Recent Events</span>
        <div
          className={`flex flex-col overflow-y-scroll ${
            expanded === "usher"
              ? "h-[calc(100vh-200px)]"
              : "h-[calc(calc(50vh-150px))]"
          }`}
        >
          {events.map((data, idx) => (
            <EventCard key={idx} data={data} />
          ))}
        </div>
      </div>
      {expanded === "usher" && (
        <div className="col-span-2 pt-6 px-1 h-[calc(100vh-200px)]">
          {/* <span className="text-gray-500 font-medium">&nbsp;</span> */}

          <GoogleMap
            mapContainerStyle={{ height: "100%", width: "100%" }}
            center={defaultProps.center}
            zoom={defaultProps.zoom}
            options={{ mapId: defaultProps.mapId }}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            {getUniqueUsherBldg(events).map((data, idx) => (
              <Marker
                key={idx}
                position={{ lat: +data.bldg_lat, lng: +data.bldg_long }}
                icon={usherMarker}
              >
                <InfoWindow>
                  <span className="font-semibold uppercase">
                    {data.bldg_name}
                  </span>
                </InfoWindow>
              </Marker>
            ))}
          </GoogleMap>
        </div>
      )}
    </div>
  );
};

const EventCard = ({ data }) => (
  <div className="bg-gray-50 w-full rounded-md mb-2 border-gray-100 border-2 p-2 flex flex-row justify-start items-center">
    <div
      style={{ backgroundColor: intensityColorMap[+data.final_intensity] }}
      className={`rounded-xl w-16 h-16 min-w-[64px] my-2 mx-4 flex items-center justify-center text-3xl font-medium`}
    >
      {data.final_intensity === "2" || data.final_intensity === "3"
        ? "2-3"
        : data.final_intensity}
    </div>
    <div className="flex flex-col">
      <span className="font-medium text-orange-600">
        {moment(data.created_at).format("LLL")}
      </span>
      <span className="font-semibold uppercase">{data.bldg_name}</span>
      <span className="font-medium">{data.node_location}</span>
      {/* <div className="flex flex-row flex-wrap">
        <div className="text-xs px-2 py-1 mr-1 mb-1 flex flex-row flex-wrap rounded-md bg-gray-50 border-gray-200 border-2">
          X Axis(g): {data.x_max}
        </div>
        <div className="text-xs px-2 py-1 mr-1 mb-1 flex flex-row flex-wrap rounded-md bg-gray-50 border-gray-200 border-2">
          Y Axis(g): {data.y_max}
        </div>
        <div className="text-xs px-2 py-1 mr-1 mb-1 flex flex-row flex-wrap rounded-md bg-gray-50 border-gray-200 border-2">
          Z Axis(g): {data.z_max}
        </div>
      </div> */}
    </div>
  </div>
);

export default Earthquake;
