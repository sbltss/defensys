import React from "react";
import { Drawer } from "antd";
import ResponseTeamTable from "./AssignResponseTeam/ResponseTeamTable";
import { useState } from "react";
import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";
import { useEffect } from "react";
import { responseTeamsList } from "../../../../../../store/api/resources-api";
import { useSelector } from "react-redux";
import UseFirebaseDB from "../../../../../../Hooks/use-firebasedb";

const AssignRTDrawer = ({ assigning, setAssigning, selectedTicket }) => {
  const { selectedAcceptedTicket } = useSelector((state) => state.tickets);
  const [rtLocations] = UseFirebaseDB("/location");
  const [map, setMap] = useState(null);
  const [defaultProps] = useState({
    center: {
      lat: 14.533103851530154,
      lng: 121,
    },
    zoom: 11,
    mapId: "15f9baeb3890ce9f",
    clickableIcons: false,
  });
  const [responseTeams, setResponseTeams] = useState([]);
  useEffect(() => {
    const fetchRt = async () => {
      const response = await responseTeamsList({
        queries: {
          transactionNumber: selectedAcceptedTicket?.transactionNumber,
        },
      });
      setResponseTeams(response.data);
    };
    if (assigning && selectedAcceptedTicket?.transactionNumber) fetchRt();
  }, [assigning, selectedAcceptedTicket?.transactionNumber]);
  return (
    <Drawer
      height={"70vh"}
      onClose={() => {
        setAssigning(false);
      }}
      open={assigning}
      placement="bottom"
      title="Assign response teams to selected ticket"
    >
      <div className="w-full h-full flex flex-row gap-4">
        <div className="w-2/3">
          <ResponseTeamTable
            assigning={assigning}
            responseTeams={responseTeams}
            rtLocations={rtLocations}
          />
        </div>
        <div className="w-1/3">
          <GoogleMap
            mapContainerStyle={{ height: "100%", width: "100%" }}
            options={defaultProps}
            onLoad={(map) => setMap(map)}
            onUnmount={() => setMap(null)}
          >
            {selectedTicket && (
              <Marker
                icon={{
                  url: selectedTicket.caseTypeIcon
                    ? `${import.meta.env.VITE_BASE_URL}/${
                        selectedTicket.caseTypeIcon
                      }`
                    : selectedTicket.icon
                    ? `${import.meta.env.VITE_BASE_URL}/${selectedTicket.icon}`
                    : undefined,
                  scaledSize: { height: 40, width: 40 },
                }}
                position={{
                  lat: +selectedTicket.latitude,
                  lng: +selectedTicket.longitude,
                }}
              >
                <InfoWindow
                  // options={{
                  //   pixelOffset: new window.google.maps.Size(0, -38),
                  // }}
                  position={{
                    lat: +selectedTicket.latitude,
                    lng: +selectedTicket.longitude,
                  }}
                >
                  <div>
                    <h1 className="font-medium">Emergency Location</h1>
                  </div>
                </InfoWindow>
              </Marker>
            )}
            {responseTeams.length > 0 &&
              responseTeams.map((team) => {
                if (
                  +rtLocations?.[team.accountId]?.latitude &&
                  +rtLocations?.[team.accountId]?.longitude &&
                  rtLocations?.[team.accountId]?.isOnline
                )
                  return (
                    <Marker
                      key={team.accountId}
                      // animation={1}
                      position={{
                        lat: +rtLocations?.[team.accountId]?.latitude,
                        lng: +rtLocations?.[team.accountId]?.longitude,
                      }}
                    >
                      <InfoWindow
                        options={{
                          pixelOffset: new window.google.maps.Size(0, -38),
                        }}
                        position={{
                          lat: +rtLocations?.[team.accountId]?.latitude,
                          lng: +rtLocations?.[team.accountId]?.longitude,
                        }}
                      >
                        <span className="font-medium">{`${team.firstName} ${team.lastName}`}</span>
                      </InfoWindow>
                    </Marker>
                  );
              })}
          </GoogleMap>
        </div>
      </div>
    </Drawer>
  );
};

export default AssignRTDrawer;
