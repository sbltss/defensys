import {
  GoogleMap,
  Marker,
  HeatmapLayer,
  Polygon,
} from "@react-google-maps/api";
import buttonMarker from "../../../../assets/img/map/button.png";
import React, { useCallback, useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { mapActions, resourcesActions } from "../../../../store/store";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import RangePicker from "./RangePicker";
import UseMapControl from "../../../../Hooks/use-mapControl";
import taguigGeoJson from "../../../../assets/map/taguigMapPolygons.json";
import { getBarangayValues, colors } from "../../../../helpers";
import PolygonDrawer from "./Drawer/PolygonDrawer";
import MarkerDrawer from "./Drawer/MarkerDrawer";
import axios from "axios";
const { fetchResources } = resourcesActions;
const { fetchTickets } = mapActions;

const MapPage = () => {
  const [markerVisible, markerButton] = UseMapControl("Marker");
  const [heatmapVisible, heatmapButton] = UseMapControl("Heatmap");
  const [barangayVisible, barangayButton] = UseMapControl("Barangay");
  const [sosButtonVisible, sosButtonButton] = UseMapControl("SOS Button");
  const dispatch = useDispatch();
  const [geoJson, setGeoJson] = useState(null);
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [ticketsPerBarangay, setTicketsPerBarangay] = useState([]);
  const { currentUser } = useSelector((state) => state.auth);
  const [center] = useState({
    lat: currentUser?.latitude ? +currentUser?.latitude : 14.520445,
    lng: currentUser?.longitude ? +currentUser?.longitude : 121.053886,
  });
  const { fetchedTickets } = useSelector((state) => state.map);
  const resources = useSelector((state) => state.resources);
  const { caseTypes, deviceList } = resources;
  const onLoad = useCallback(
    function callback(map) {
      const controlButton = document.createElement("div");
      controlButton.className = "flex flex-row gap-2 p-2";
      controlButton.append(markerButton.current);
      controlButton.append(heatmapButton.current);
      controlButton.append(barangayButton.current);
      controlButton.append(sosButtonButton.current);
      map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(
        controlButton
      );
    },
    [barangayButton, heatmapButton, markerButton, sosButtonButton]
  );
  const defaultProps = {
    center,
    zoom: 12,
    mapId: "15f9baeb3890ce9f",
  };

  useEffect(() => {
    setSelectedDateRange([dayjs().add(-30, "d"), dayjs()]);
    dispatch(
      fetchResources({
        toFetch: ["caseTypes", "deviceList"],
        existing: resources,
      })
    );
  }, [dispatch]);
  useEffect(() => {
    if (selectedDateRange)
      dispatch(
        fetchTickets({
          dateFrom: selectedDateRange[0].format("YYYY-MM-DD"),
          dateTo: selectedDateRange[1].format("YYYY-MM-DD"),
        })
      );
  }, [dispatch, selectedDateRange]);

  useEffect(() => {
    if (fetchedTickets.length > 0 && caseTypes.length > 0 && geoJson)
      setTicketsPerBarangay(
        getBarangayValues(fetchedTickets, caseTypes, geoJson)
      );
  }, [fetchedTickets, caseTypes, geoJson]);
  const getFillOpacity = (barangayName) => {
    const highestCount = ticketsPerBarangay.sort((a, b) => {
      if (a.counts.total < b.counts.total) {
        return 1;
      }
      if (a.counts.total > b.counts.total) {
        return -1;
      }
      return 0;
    })?.[0]?.counts?.total;
    const barangayCount = ticketsPerBarangay.filter(
      (b) => b.brgyName === barangayName
    )?.[0]?.counts?.total;
    if (isNaN(((barangayCount / highestCount) * 100).toFixed(0))) return 1;
    else return ((barangayCount / highestCount) * 100).toFixed(0);
  };
  const getBarangayCounts = (barangayName) => {
    return ticketsPerBarangay.filter((b) => b.brgyName === barangayName)?.[0];
  };

  const fetchGeoJson = async (cityId) => {
    const request = await axios.get(
      `https://raw.githubusercontent.com/DGSI-Dev/philippines-json-maps/master/2019/geojson/barangays/hires/barangays-municity-ph${cityId}000.0.1.json`
      // `https://raw.githubusercontent.com/faeldon/philippines-json-maps/master/geojson/barangays/hires/barangays-municity-ph${cityId}000.0.1.json`
    );
    setGeoJson(request.data);
  };

  useEffect(() => {
    if (currentUser.cityId) fetchGeoJson(currentUser.cityId);
  }, [currentUser.cityId]);
  return (
    <>
      <Helmet>
        <title>Defensys | Accounts - Map</title>
      </Helmet>
      <PolygonDrawer
        selectedPolygon={selectedPolygon}
        setSelectedPolygon={setSelectedPolygon}
      />
      <MarkerDrawer
        selectedMarker={selectedMarker}
        setSelectedMarker={setSelectedMarker}
      />
      <div className="bg-white rounded w-full h-full shadow p-4 flex flex-col">
        <div className="border-b flex flex-row justify-between p-2">
          <span className="font-semibold text-xl">Map</span>

          <RangePicker
            selectedDateRange={selectedDateRange}
            setSelectedDateRange={setSelectedDateRange}
          />
        </div>
        <div className="w-full h-full">
          <GoogleMap
            mapContainerStyle={{ height: "100%", width: "100%" }}
            center={defaultProps.center}
            zoom={defaultProps.zoom}
            options={{ mapId: defaultProps.mapId, disableDefaultUI: true }}
            onLoad={onLoad}
          >
            {geoJson &&
              geoJson.features.map((feature) => {
                return (
                  <Polygon
                    visible={barangayVisible}
                    options={{
                      strokeWeight: 2,
                      strokeOpacity: 0.2,
                      strokeColor: "#fff",
                      fillColor:
                        colors[getFillOpacity(feature.properties.ADM4_EN) - 1],
                      fillOpacity: 0.5,
                    }}
                    onClick={() =>
                      setSelectedPolygon({
                        ...feature.properties,
                        ...getBarangayCounts(feature.properties.ADM4_EN),
                      })
                    }
                    key={feature.properties.ADM4_EN}
                    // path={feature.geometry.coordinates[0].map((data) => {
                    //   return new window.google.maps.LatLng(data[1], data[0]);
                    // })}
                    paths={feature.geometry.coordinates.map((coordinate) => {
                      if (coordinate.length === 1)
                        return coordinate[0].map((data) => {
                          return new window.google.maps.LatLng(
                            data[1],
                            data[0]
                          );
                        });
                      return coordinate.map((data) => {
                        return new window.google.maps.LatLng(data[1], data[0]);
                      });
                    })}
                  />
                );
              })}
            {deviceList.map((data, idx) =>
              data.isDeleted === 0 ? (
                <Marker
                  icon={buttonMarker}
                  // onClick={() => setSelectedMarker(data)}
                  visible={sosButtonVisible}
                  key={idx}
                  position={{ lat: +data.latitude, lng: +data.longitude }}
                />
              ) : null
            )}
            {fetchedTickets.map((data, idx) => (
              <Marker
                onClick={() => setSelectedMarker(data)}
                visible={markerVisible}
                key={idx}
                position={{ lat: +data.latitude, lng: +data.longitude }}
              />
            ))}
            {heatmapVisible && (
              <HeatmapLayer
                data={fetchedTickets.map(
                  (data) =>
                    new window.google.maps.LatLng(
                      +data.latitude,
                      +data.longitude
                    )
                )}
              />
            )}
          </GoogleMap>
        </div>
      </div>
    </>
  );
};

export default MapPage;
