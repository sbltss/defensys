import { DatePicker } from "antd";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Reports from "./Table/Reports";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { reportsActions, resourcesActions } from "../../../../store/store";
import TicketReport from "./Drawer/TicketReport";
const { fetchTickets, setSelectedTicket, fetchReportData } = reportsActions;
const { fetchResources } = resourcesActions;

const ReportsPage = () => {
  const dispatch = useDispatch();
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const resources = useSelector((state) => state.resources);
  const { selectedTicket, reportData } = useSelector((state) => state.reports);

  const selectTicketHandler = (e) => {
    dispatch(setSelectedTicket(e));
  };

  const dateRangeChangedHandler = (e) => {
    setSelectedDateRange(e);
  };
  useEffect(() => {
    if (resources.reportCategory.length === 0)
      dispatch(
        fetchResources({ existing: resources, toFetch: ["reportCategory"] })
      );
  }, [dispatch, resources]);
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
    setSelectedDateRange([dayjs().subtract(1, "month"), dayjs()]);
  }, []);

  useEffect(() => {
    if (selectedTicket)
      dispatch(fetchReportData(selectedTicket.transactionNumber));
  }, [selectedTicket, dispatch]);

  return (
    <>
      <Helmet>
        <title>Defensys | Accounts - Reports</title>
      </Helmet>
      <TicketReport
        reload={() =>
          dispatch(fetchReportData(selectedTicket.transactionNumber))
        }
        reportData={reportData}
        selectTicketHandler={selectTicketHandler}
      />
      <div className=" bg-white rounded w-full shadow p-4 flex flex-col">
        <div className="border-b flex flex-row justify-between p-2">
          <span className="font-semibold text-xl">Reports</span>
          <DatePicker.RangePicker
            value={selectedDateRange}
            onChange={dateRangeChangedHandler}
            format={"MMM DD, YYYY"}
          />
        </div>
        <div className="w-full h-full">
          <Reports selectTicketHandler={selectTicketHandler} />
        </div>
      </div>
    </>
  );
};

export default ReportsPage;
