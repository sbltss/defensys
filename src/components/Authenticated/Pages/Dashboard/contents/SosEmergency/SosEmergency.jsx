import axios from "axios";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";
import withInjuryIcon from "../../../../../../assets/img/icons/withInjury.png";
import withoutInjuryIcon from "../../../../../../assets/img/icons/withoutInjury.png";
import { formatData, truncateString } from "../../../../../../helpers";
import {
  dashboardActions,
  resourcesActions,
} from "../../../../../../store/store";

const { fetchResources } = resourcesActions;
const { getSosData } = dashboardActions;

const barangayFeatures = [];

const SosEmergency = ({ expanded }) => {
  const dispatch = useDispatch();
  const { sosData } = useSelector((state) => state.dashboard);
  const resources = useSelector((state) => state.resources);
  const { currentUser } = useSelector((state) => state.auth);
  const [geoJson, setGeoJson] = useState(null);
  const { caseTypes } = resources;

  const fetchGeoJson = async (cityId) => {
    const request = await axios.get(
      `https://raw.githubusercontent.com/faeldon/philippines-json-maps/master/geojson/barangays/hires/barangays-municity-ph${cityId}000.0.1.json`
    );
    setGeoJson(request.data);
  };

  useEffect(() => {
    if (currentUser.cityId) fetchGeoJson(currentUser.cityId);
  }, [currentUser.cityId]);

  const [dashboardData, setDashboardData] = useState({
    reportedCount: [
      { count: 0, title: "Today" },
      { count: 0, title: "This Week" },
      { count: 0, title: "This Month" },
      { count: 0, title: "This Year" },
    ],
    resolvedCount: [
      { count: 0, title: "Today" },
      { count: 0, title: "This Week" },
      { count: 0, title: "This Month" },
      { count: 0, title: "This Year" },
    ],
    ticketsByCaseTypes: [],
    withInjuryCount: {
      icon: withInjuryIcon,
      count: 0,
      rate: 0,
    },
    withoutInjuryCount: {
      icon: withoutInjuryIcon,
      count: 0,
      rate: 0,
    },
    barangayValues: [],
  });
  const [pieChartData, setPieChartData] = useState({
    series: [],
    options: {
      labels: [],
      plotOptions: {
        pie: {
          donut: {
            size: "80%",
            labels: {
              show: true,
              name: {
                show: true,
              },
              value: {
                show: true,
                formatter: (e) => e || 0,
              },
              total: {
                show: true,
                formatter: (e) =>
                  e.config.series.reduce((pSum, a) => pSum + a, 0),
              },
            },
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      chart: {
        type: "donut",
        redrawOnParentResize: true,
      },
      legend: {
        // formatter: (e) => (e.length > 20 ? e.substr(0, 20) + "..." : e),
        show: true,
        fontSize: "10px",
        markers: {
          width: 10,
          height: 10,
        },
        itemMargin: {
          horizontal: 0,
          vertical: 0,
        },
      },
    },
  });

  useEffect(() => {
    dispatch(getSosData());
  }, []);

  useEffect(() => {
    if (geoJson) {
      let tempDashboardData = formatData(sosData, caseTypes, geoJson);
      let sortedCaseByTypes = tempDashboardData.ticketsByCaseTypes.sort(
        (a, b) => b.value - a.value
      );
      setDashboardData(tempDashboardData);
      setPieChartData((prevState) => {
        return {
          ...prevState,
          series: sortedCaseByTypes.map((d) => d.value),
          options: {
            ...prevState.options,
            labels: sortedCaseByTypes.map((d) => d.name),
          },
        };
      });
    }
  }, [sosData, caseTypes, geoJson]);
  return (
    <div className="grid lg:grid-cols-2 xl:grid-flow-row xl:grid-cols-1 lg:gap-2 xl:gap-4 ">
      <div className="lg:col-span-1 xl:col-span-1">
        <span className="mb-2 font-semibold italic text-lg">
          Types of Incidents
        </span>
        <div className="w-full">
          <Chart
            height={"110%"}
            width={"100%"}
            options={pieChartData.options}
            series={pieChartData.series}
            type="donut"
          />
        </div>
      </div>
      <div className="lg:col-span-1 xl:col-span-1">
        <span className="mb-2 font-semibold italic text-lg">
          Incidents of Barangays
        </span>
        <div className="w-full overflow-x-scroll overflow-y-hidden">
          <Chart
            height={"120%"}
            // width={
            //   dashboardData.barangayValues?.filter((val) => val.counts.total > 0)
            //     .length * 30
            // }
            options={{
              chart: {
                type: "bar",
              },
              plotOptions: {
                bar: {
                  borderRadius: 2,
                  horizontal: false,
                },
              },
              dataLabels: {
                enabled: false,
              },
              xaxis: {
                tooltip: {
                  enabled: true,
                  formatter: (e) => {
                    return e;
                  },
                },
                labels: {
                  show: true,
                  formatter: (e) => {
                    return truncateString(e, 7);
                  },
                },
                categories: dashboardData.barangayValues?.map(
                  (d) => d.brgyName
                ),
              },
            }}
            series={[
              {
                name: "Emergency Tickets",
                data: dashboardData.barangayValues?.map((d) => d.counts.total),
              },
            ]}
            type="bar"
          />
        </div>
      </div>
      <div className="flex flex-col lg:col-span-2 xl:col-span-1 xl:gap-4">
        <div className="w-full flex flex-row justify-between ">
          <div className="w-1/2 text-center border-r-2 border-gray-100">
            <span className="mb-2 font-semibold italic">
              Incidents Reported
            </span>
            <div className="flex flex-row flex-wrap justify-around">
              {dashboardData?.reportedCount?.map((count, index) => (
                <CountBox data={count} key={index} />
              ))}
            </div>
          </div>
          <div className="w-1/2 text-center border-l-2 border-gray-100">
            <span className="mb-2 font-semibold italic">
              Incidents Resolved
            </span>
            <div className="flex flex-row flex-wrap justify-around">
              {dashboardData?.resolvedCount?.map((count, index) => (
                <CountBox data={count} key={index} />
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-row justify-between">
          <div className="w-1/2 mr-2">
            <span className="mb-2 font-semibold italic ">With Injury</span>
            <InjuryBox data={dashboardData.withInjuryCount} />
          </div>
          <div className="w-1/2 ml-2">
            <span className="mb-2 font-semibold italic ">Without Injury</span>
            <InjuryBox data={dashboardData.withoutInjuryCount} />
          </div>
        </div>
      </div>
    </div>
  );
};

const CountBox = ({ data }) => (
  <div className="text-center mx-3">
    <div className="bg-primary-200 h-14 w-14 flex justify-center items-center rounded-md border-gray-200 border-2">
      <span className="text-gray-800 font-semibold text-3xl">{data.count}</span>
    </div>
    <span className="text-gray-500 font-medium text-xs">{data.title}</span>
  </div>
);

const InjuryBox = ({ data }) => (
  <div className="bg-primary-200 h-14 w-full flex justify-center items-center rounded-md border-gray-200 border-2">
    <img
      className="bg-white rounded-lg p-2 h-3/5"
      src={data?.icon}
      alt="icon"
    />
    <div>
      <span className="text-gray-800 font-semibold text-3xl ml-3">
        {data?.count}
      </span>
      <span
        className={
          "text-gray-500 font-semibold text-sm ml-1 " +
          (data?.rate > 50 ? "text-green-600" : "text-red-600")
        }
      >
        {data?.rate}%
      </span>
    </div>
  </div>
);

export default SosEmergency;
