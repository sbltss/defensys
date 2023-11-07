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
  const { token } = useSelector((state) => state.auth);
  const resources = useSelector((state) => state.resources);
  const { caseTypes } = resources;

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
                formatter: (e) => e.config.series[0] || 0,
                // .reduce((pSum, a) => pSum + a, 0)
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
        show: true,
      },
    },
  });

  useEffect(() => {
    if (token) {
      setTimeout(() => {
        dispatch(getSosData());
        dispatch(
          fetchResources({ toFetch: ["caseTypes"], existing: resources })
        );
      }, 500);
    }
  }, [token]);

  useEffect(() => {
    let tempDashboardData = formatData(sosData, caseTypes);
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
  }, [sosData]);
  return (
    <div className="">
      <span className="mb-2 font-semibold italic text-lg h-[30%]">
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
      <span className="mb-2 font-semibold italic text-lg">
        Incidents of Barangays
      </span>
      <div className="w-full overflow-x-scroll overflow-y-hidden h-[30%]">
        <Chart
          height={"120%"}
          width={dashboardData.barangayValues?.length * 30}
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
              categories: dashboardData.barangayValues?.map((d) => d.brgyCode),
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
      <div className="w-full flex flex-row justify-between h-[30%]">
        <div className="w-1/2 text-center border-r-2 border-gray-100">
          <span className="mb-2 font-semibold italic text-lg">
            Incidents Reported
          </span>
          <div className="flex flex-row flex-wrap justify-around">
            {dashboardData?.reportedCount?.map((count, index) => (
              <CountBox data={count} key={index} />
            ))}
          </div>
        </div>
        <div className="w-1/2 text-center border-l-2 border-gray-100">
          <span className="mb-2 font-semibold italic text-lg">
            Incidents Resolved
          </span>
          <div className="flex flex-row flex-wrap justify-around">
            {dashboardData?.resolvedCount?.map((count, index) => (
              <CountBox data={count} key={index} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-row justify-between h-[10%]">
        <div className="w-1/2 mr-2">
          <span className="mb-2 font-semibold italic text-lg">With Injury</span>
          <InjuryBox data={dashboardData.withInjuryCount} />
        </div>
        <div className="w-1/2 ml-2">
          <span className="mb-2 font-semibold italic text-lg">
            Without Injury
          </span>
          <InjuryBox data={dashboardData.withoutInjuryCount} />
        </div>
      </div>
    </div>
  );
};

const CountBox = ({ data }) => (
  <div className="text-center mx-3">
    <div className="bg-primary-200 h-[70px] w-[70px] flex justify-center items-center rounded-md border-gray-200 border-2">
      <span className="text-gray-800 font-semibold text-3xl">{data.count}</span>
    </div>
    <span className="text-gray-500 font-medium text-md">{data.title}</span>
  </div>
);

const InjuryBox = ({ data }) => (
  <div className="bg-primary-200 h-[70px] w-full flex justify-center items-center rounded-md border-gray-200 border-2">
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
