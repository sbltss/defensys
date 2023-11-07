import React, { useEffect, useState } from "react";
import { Drawer } from "antd";
import Chart from "react-apexcharts";
import { useSelector } from "react-redux";

const PolygonDrawer = ({ selectedPolygon, setSelectedPolygon }) => {
  const { ADM4_EN, counts } = selectedPolygon || {};
  const { caseTypes } = useSelector((state) => state.resources);
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
        position: "bottom",
        horizontalAlign: "left",
        width: "100%",
      },
    },
  });
  useEffect(() => {
    if (selectedPolygon?.counts?.total > 0) {
      let sortedCaseByTypes = Object.keys(counts)
        .filter((c) => counts[c] !== 0 && c !== "total")
        .map((c) => ({
          name: caseTypes.find((ct) => +ct.id === +c)?.typeName,
          value: counts[c],
        }))
        .sort((a, b) => b.value - a.value);
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
  }, [selectedPolygon, caseTypes, counts]);
  return (
    <Drawer
      width={"500px"}
      title={ADM4_EN || ""}
      placement="right"
      onClose={() => setSelectedPolygon(null)}
      open={!!selectedPolygon}
    >
      {!counts?.total && <span>No Emergency Ticket For This Barangay</span>}
      {counts?.total > 0 && (
        <>
          <span className="font-medium text-gray-800">
            Emergency Tickets By Type
          </span>
          <Chart
            width={"100%"}
            options={pieChartData.options}
            series={pieChartData.series}
            type="donut"
          />
        </>
      )}
    </Drawer>
  );
};

export default PolygonDrawer;
