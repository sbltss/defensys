import React from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";

const RangePicker = ({ setSelectedDateRange, selectedDateRange }) => {
  const rangePresets = [
    {
      label: "Today",
      value: [dayjs(), dayjs().add(1, "d")],
    },
    {
      label: "Last 7 Days",
      value: [dayjs().add(-7, "d"), dayjs()],
    },
    {
      label: "Last 14 Days",
      value: [dayjs().add(-14, "d"), dayjs()],
    },
    {
      label: "Last 30 Days",
      value: [dayjs().add(-30, "d"), dayjs()],
    },
    {
      label: "Last 90 Days",
      value: [dayjs().add(-90, "d"), dayjs()],
    },
    {
      label: "Last 365 Days",
      value: [dayjs().add(-365, "d"), dayjs()],
    },
  ];
  const dateRangeChangedHandler = (e) => {
    setSelectedDateRange(e);
  };
  return (
    <DatePicker.RangePicker
      defaultValue={[dayjs().add(-30, "d"), dayjs()]}
      presets={rangePresets}
      onChange={dateRangeChangedHandler}
      value={selectedDateRange}
    />
  );
};

export default RangePicker;
