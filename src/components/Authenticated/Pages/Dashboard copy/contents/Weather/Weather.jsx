import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import moment from "moment/moment";
import React, { useEffect, useState } from "react";
import {
  LayersControl,
  MapContainer,
  Marker,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import {
  RainyDayIcon,
  SunnyDayIcon,
  WindyDayIcon,
} from "../../../../../../assets/icons/Icons";
import { weatherActions } from "../../../../../../store/store";
const { fetchWeather } = weatherActions;
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
  const [selectedLayer, setSelectedLayer] = useState("clouds_new");
  const [selectedCoor, setSelectedCoor] = useState({
    lat: 14.553401236124595,
    lng: 121.04629123771413,
  });
  const { weather } = useSelector((state) => state.weather);
  const sampleWeather = {
    coord: {
      lon: 121.1543,
      lat: 14.567,
    },
    weather: [
      {
        id: 803,
        main: "Clouds",
        description: "broken clouds",
        icon: "04d",
      },
    ],
    base: "stations",
    main: {
      temp: 298.25,
      feels_like: 299.19,
      temp_min: 298.25,
      temp_max: 298.77,
      pressure: 1012,
      humidity: 91,
      sea_level: 1012,
      grnd_level: 1002,
    },
    visibility: 10000,
    wind: {
      speed: 6.04,
      deg: 84,
      gust: 11.22,
    },
    clouds: {
      all: 79,
    },
    dt: 1672996144,
    sys: {
      type: 2,
      id: 2005706,
      country: "PH",
      sunrise: 1672957306,
      sunset: 1672997978,
    },
    timezone: 28800,
    id: 1682598,
    name: "Taytay",
    cod: 200,
  };
  useEffect(() => {
    // dispatch(fetchWeather(selectedCoor));
  }, [selectedCoor]);
  return (
    <div className={"w-full h-full"}>
      <MapContainer
        style={{ height: expanded === "weather" ? "100vh" : "36vh" }}
        center={[selectedCoor.lat, selectedCoor.lng]}
        zoom={7}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LayersControl position="topright">
          <LayersControl.Overlay name="Clouds">
            <TileLayer
              attribution='&copy; <a href="https://openweathermap.org/">Weather data provided by OpenWeather</a> contributors'
              url="https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=e936d77b16565cc065673863fe7443a4"
            />
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Precipitation">
            <TileLayer
              attribution='&copy; <a href="https://openweathermap.org/">Weather data provided by OpenWeather</a> contributors'
              url="https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=e936d77b16565cc065673863fe7443a4"
            />
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Sea Level Pressure">
            <TileLayer
              attribution='&copy; <a href="https://openweathermap.org/">Weather data provided by OpenWeather</a> contributors'
              url="https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=e936d77b16565cc065673863fe7443a4"
            />
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Wind Speed">
            <TileLayer
              attribution='&copy; <a href="https://openweathermap.org/">Weather data provided by OpenWeather</a> contributors'
              url="https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=e936d77b16565cc065673863fe7443a4"
            />
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Temperature">
            <TileLayer
              attribution='&copy; <a href="https://openweathermap.org/">Weather data provided by OpenWeather</a> contributors'
              url="https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=e936d77b16565cc065673863fe7443a4"
            />
          </LayersControl.Overlay>
        </LayersControl>

        <Marker
          icon={DefaultIcon}
          position={[selectedCoor.lat, selectedCoor.lng]}
        ></Marker>
        {/* <Control position="topright">
          <div className="flex flex-col gap-1">
            {layers.map((layer) => (
              <Button
                key={layer.id}
                text={layer.name}
                type={selectedLayer === layer.id ? "primary" : "muted"}
                onClick={() => setSelectedLayer(layer.id)}
              />
            ))}
          </div>
        </Control> */}
        <WeatherHelperChild setSelectedCoor={setSelectedCoor} />
      </MapContainer>
      {expanded === "weather" && Object.keys(weather).length > 0 && (
        <div className="w-full grid grid-cols-3 grid-flow-col gap-4">
          <div className="grid grid-rows-2 grid-flow-row col-span-2 gap-4">
            <div className="flex flex-col gap-2 p-4">
              <div>
                <span className="text-3xl font-semibold">{weather.name}</span>
              </div>
              <div className="grid grid-rows-3 grid-flow-col gap-4">
                <span className="text-md font-medium">
                  Pressure: <span>{weather.main?.pressure}</span>
                </span>
                <span className="text-md font-medium">
                  Clouds: <span>{weather.clouds?.all}</span>
                </span>
                <span className="text-md font-medium">
                  Wind Direction: <span>{weather.wind?.deg}</span>
                </span>
                <span className="text-md font-medium">
                  Humidity: <span>{weather.main?.humidity}</span>
                </span>
                <span className="text-md font-medium">
                  Wind Speed: <span>{weather.wind?.speed}</span>
                </span>
              </div>
            </div>
            <div className=" p-4">
              <div>
                <span className="text-md font-semibold">
                  7 - Day Weather Outlook for Port Area, Metro Manila
                </span>
              </div>
              <div className="flex flex-row justify-around flex-wrap gap-2">
                <WeatherCardSquare type={"rainy"} />
                <WeatherCardSquare type={"sunny"} />
                <WeatherCardSquare type={"sunny"} />
                <WeatherCardSquare type={"sunny"} />
                <WeatherCardSquare type={"sunny"} />
                <WeatherCardSquare type={"windy"} />
                <WeatherCardSquare type={"windy"} />
              </div>
            </div>
          </div>
          <div className="grid grid-rows-2 col-span-2 gap-4">
            <div className="p-4">
              <div>
                <span className="text-xl font-semibold">Weather</span>
              </div>
              <WeatherCardRectangle type={"sunny"} weather={weather} />
            </div>
            <div className="p-4">asdsad</div>
          </div>
        </div>
      )}
    </div>
  );
};

const WeatherCardSquare = ({ type }) => {
  const style =
    type === "sunny"
      ? {
          background: "linear-gradient(133.35deg, #6B6D70 4.67%, #758397 100%)",
        }
      : type === "rainy"
      ? {
          background: "linear-gradient(135.71deg, #719DC7 0%, #79A3D1 101.27%)",
        }
      : {
          background: "linear-gradient(135deg, #8AD6E8 0%, #8AC9E7 100%)",
        };
  return (
    <div
      style={style}
      className="text-white w-[130px] h-[130px] rounded-xl flex flex-col justify-center items-center"
    >
      <div className="flex flex-row justify-center items-end gap-1">
        <span className="text-4xl">27°</span>
        {type === "sunny" && <SunnyDayIcon />}
        {type === "rainy" && <RainyDayIcon />}
        {type === "windy" && <WindyDayIcon />}
      </div>
      <div className="flex flex-col">
        <span className="leading-none">Monday</span>
        <span className="leading-none">23 December</span>
      </div>
    </div>
  );
};

const WeatherCardRectangle = ({ type, weather }) => {
  const {
    main: { humidity, pressure, temp },
    wind: { speed, deg },
    clouds: { all },
    weather: currentWeather,
    name,
  } = weather || {};
  const style =
    currentWeather.main === "Clear"
      ? {
          background: "linear-gradient(133.35deg, #6B6D70 4.67%, #758397 100%)",
        }
      : currentWeather.main === "rainy"
      ? {
          background: "linear-gradient(135.71deg, #719DC7 0%, #79A3D1 101.27%)",
        }
      : {
          background: "linear-gradient(135deg, #8AD6E8 0%, #8AC9E7 100%)",
        };
  return (
    <div
      style={style}
      className="text-white w-full h-[130px] rounded-xl flex flex-row justify-center items-center gap-4"
    >
      <span className="text-6xl">{temp}°</span>
      <div className="flex flex-col">
        <span className="leading-none">{moment().format("dddd, DD MMMM")}</span>
        <span className="leading-none">{name}</span>
      </div>

      <div className="flex flex-row justify-center items-end gap-1 mb-8">
        {currentWeather.main === "Clear" && <SunnyDayIcon />}
        {currentWeather.main === "rainy" && <RainyDayIcon />}
        {currentWeather.main === "windy" && <WindyDayIcon />}
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
