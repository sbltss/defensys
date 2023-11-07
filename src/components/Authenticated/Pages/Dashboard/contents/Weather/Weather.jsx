import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import moment from "moment-timezone";
import React, { useEffect, useState, useRef } from "react";
import {
  LayersControl,
  MapContainer,
  Marker,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import { RainDropIcon } from "../../../../../../assets/icons/Icons";
import { weatherActions } from "../../../../../../store/store";
import { Input } from "antd";
const { fetchWeather, fetchForecast } = weatherActions;
const layers = [
  {
    id: "clouds_new",
    name: "Clouds",
  },
  {
    id: "precipitation_new",
    name: "Precipitation",
  },
  {
    id: "pressure_new",
    name: "Sea level pressure",
  },
  {
    id: "wind_new",
    name: "Wind speed",
  },
  {
    id: "temp_new",
    name: "Temperature",
  },
];
let DefaultIcon = L.icon({
  iconAnchor: [10, 40],
  iconUrl: icon,
  shadowUrl: iconShadow,
});
const Weather = ({ expanded }) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  // const [selectedLayer, setSelectedLayer] = useState("clouds_new");
  const [selectedCoor, setSelectedCoor] = useState({
    lat: currentUser?.latitude ? +currentUser?.latitude : 14.520445,
    lng: currentUser?.longitude ? +currentUser?.longitude : 121.053886,
  });

  const { weather, forecast } = useSelector((state) => state.weather);

  useEffect(() => {
    dispatch(fetchWeather(selectedCoor));
    dispatch(fetchForecast(selectedCoor));
  }, [selectedCoor]);

  const searchInput = useRef(null);

  useEffect(() => {
    let autocomplete;
    if (searchInput.current && !autocomplete) {
      autocomplete = new window.google.maps.places.Autocomplete(
        searchInput.current.input,
        {
          componentRestrictions: { country: ["ph"] },
          fields: ["formatted_address", "geometry"],
          types: ["establishment", "geocode"],
        }
      );
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        setSelectedCoor({
          lat: +place.geometry.location.lat(),
          lng: +place.geometry.location.lng(),
        });
      });
    }
  }, [searchInput.current]);
  return (
    <div className={"w-full h-full flex flex-col"}>
      {Object.keys(weather).length > 0 && (
        <div className="flex flex-row pb-1 gap-1">
          <div className="flex flex-col bg-primary-100 rounded-lg p-1 px-2 justify-center">
            <div className="min-w-[300px] flex flex-row rounded justify-between">
              <div className="flex flex-col justify-center">
                <span className="text-gray-900 font-bold text-xl">{`${weather.name}, ${weather.sys.country}`}</span>
                <span className="text-xs text-gray-500 font-medium capitalize">
                  {`Feels like ${weather.main.feels_like.toFixed(0)}°C. ${
                    weather.weather[0].description
                  }`}
                </span>
              </div>
              <div className="flex flex-row items-center">
                <div className="text-xl font-semibold">
                  {weather.main.temp.toFixed(0)}°C
                </div>
                <div>
                  <img
                    className="h-10"
                    alt="weather_icon"
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  />
                </div>
              </div>
            </div>
            <div className="border-t-[1px]  flex flex-col ">
              <div className=" flex flex-row gap-3">
                <span className="text-xs text-gray-500 font-medium flex flex-row gap-1 items-center">
                  <svg
                    data-v-47880d39=""
                    viewBox="0 0 1000 1000"
                    enableBackground="new 0 0 1000 1000"
                    xmlSpace="preserve"
                    className={"icon-wind-direction"}
                    height="12"
                    width="12"
                    style={{
                      transform: `rotate(${360 - weather.wind.deg}deg)`,
                    }}
                  >
                    <g data-v-47880d39="" fill="currentColor">
                      <path
                        data-v-47880d39=""
                        d="M510.5,749.6c-14.9-9.9-38.1-9.9-53.1,1.7l-262,207.3c-14.9,11.6-21.6,6.6-14.9-11.6L474,48.1c5-16.6,14.9-18.2,21.6,0l325,898.7c6.6,16.6-1.7,23.2-14.9,11.6L510.5,749.6z"
                      ></path>
                      <path
                        data-v-47880d39=""
                        d="M817.2,990c-8.3,0-16.6-3.3-26.5-9.9L497.2,769.5c-5-3.3-18.2-3.3-23.2,0L210.3,976.7c-19.9,16.6-41.5,14.9-51.4,0c-6.6-9.9-8.3-21.6-3.3-38.1L449.1,39.8C459,13.3,477.3,10,483.9,10c6.6,0,24.9,3.3,34.8,29.8l325,898.7c5,14.9,5,28.2-1.7,38.1C837.1,985,827.2,990,817.2,990z M485.6,716.4c14.9,0,28.2,5,39.8,11.6l255.4,182.4L485.6,92.9l-267,814.2l223.9-177.4C454.1,721.4,469,716.4,485.6,716.4z"
                      ></path>
                    </g>
                  </svg>
                  {`${weather.wind.speed}m/s`}
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  {`HIGH: ${weather.main.temp_max.toFixed(0)}°C`}
                </span>

                <span className="text-xs text-gray-500 font-medium">
                  {`LOW: ${weather.main.temp_min.toFixed(0)}°C`}
                </span>
              </div>
              <div className=" flex flex-row gap-3">
                <span className="text-xs text-gray-500 font-medium flex flex-row items-center">
                  <svg
                    data-v-7bdd0738=""
                    data-v-3208ab85=""
                    width="16"
                    height="16"
                    viewBox="0 0 96 96"
                    className="icon-pressure"
                  >
                    <g
                      data-v-7bdd0738=""
                      transform="translate(0,96) scale(0.100000,-0.100000)"
                      fill="currentColor"
                      stroke="none"
                    >
                      <path
                        data-v-7bdd0738=""
                        d="M351 854 c-98 -35 -179 -108 -227 -202 -27 -53 -29 -65 -29 -172 0
    -107 2 -119 29 -172 38 -75 104 -141 180 -181 58 -31 66 -32 176 -32 110 0
    118 1 175 32 77 40 138 101 178 178 31 57 32 65 32 175 0 110 -1 118 -32 176
    -40 76 -106 142 -181 179 -49 25 -71 29 -157 32 -73 2 -112 -1 -144 -13z m259
    -80 c73 -34 126 -86 161 -159 24 -50 29 -73 29 -135 0 -62 -5 -85 -29 -135
    -57 -119 -161 -185 -291 -185 -130 0 -234 66 -291 185 -24 50 -29 73 -29 135
    0 130 66 234 185 291 82 40 184 41 265 3z"
                      ></path>
                      <path
                        data-v-7bdd0738=""
                        d="M545 600 c-35 -35 -68 -60 -80 -60 -27 0 -45 -18 -45 -45 0 -33 -50
    -75 -89 -75 -18 0 -41 -5 -53 -11 -20 -11 -20 -11 3 -35 12 -13 33 -24 46 -24
    17 0 23 -6 23 -23 0 -13 10 -33 23 -45 30 -28 47 -13 47 43 0 32 6 47 28 68
    15 15 37 27 48 27 26 0 44 18 44 44 0 12 26 47 60 81 l60 61 -28 27 -28 27
    -59 -60z"
                      ></path>
                    </g>
                  </svg>
                  {`${weather.main.pressure}hPa`}
                </span>

                <span className="text-xs text-gray-500 font-medium">
                  {`Humidity: ${weather.main.humidity}%`}
                </span>
                <span className="text-xs text-gray-500 font-medium">{`Visibility: ${(
                  weather.visibility / 1000
                ).toFixed(1)}km`}</span>
              </div>
            </div>
          </div>
          {!!forecast.list && (
            <div className="flex flex-row gap-2 overflow-x-auto flex-1">
              {forecast.list.map((weather) => (
                <WeatherCardSquare key={weather.dt} weather={weather} />
              ))}
            </div>
          )}
        </div>
      )}
      <div className="pb-1">
        <Input
          allowClear={true}
          ref={searchInput}
          placeholder="Search an address"
        />
      </div>
      <div className="flex-1">
        <MapContainer
          className="h-full w-full"
          // style={{ height: expanded === "weather" ? "100vh" : "36vh" }}
          center={[selectedCoor.lat, selectedCoor.lng]}
          zoom={7}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LayersControl position="topright">
            {layers.map((layer) => (
              <LayersControl.Overlay key={layer.id} name={layer.name}>
                <TileLayer
                  attribution='&copy; <a href="https://openweathermap.org/">Weather data provided by OpenWeather</a> contributors'
                  url={`https://tile.openweathermap.org/map/${layer.id}/{z}/{x}/{y}.png?appid=e936d77b16565cc065673863fe7443a4`}
                />
              </LayersControl.Overlay>
            ))}
          </LayersControl>

          <Marker
            icon={DefaultIcon}
            position={[selectedCoor.lat, selectedCoor.lng]}
          ></Marker>

          <WeatherHelperChild setSelectedCoor={setSelectedCoor} />
        </MapContainer>
      </div>
    </div>
  );
};

const WeatherCardSquare = ({ weather }) => {
  return (
    <div className="rounded-xl flex flex-col p-2 bg-primary-100 justify-center">
      <div className="flex flex-row gap-1 items-center">
        <span className="text-xl font-semibold">
          {weather.main.temp.toFixed(0)}°C
        </span>
        <div className="w-10">
          <img
            className="w-full"
            alt="weather_icon"
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          />
        </div>
      </div>
      <div className="flex flex-row justify-between">
        <div className="flex flex-col justify-center">
          <span className="capitalize text-xs font-medium">
            <nobr>{moment(weather.dt_txt).calendar().split(" at ")[0]}</nobr>
          </span>
          <span className="capitalize text-xs font-semibold">
            <nobr>{moment(weather.dt_txt).calendar().split(" at ")[1]}</nobr>
          </span>
        </div>

        <div className="flex flex-col justify-center items-end">
          <RainDropIcon />
          <span className="text-xs font-semibold">
            {weather.main.temp.toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );
};

const WeatherHelperChild = ({ setSelectedCoor }) => {
  useMapEvents({
    click: (e) => {
      setSelectedCoor({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
};

export default Weather;
