import { Drawer, Popconfirm, message } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { rejectOfflineReport } from "../../../../../../store/api/ticket-api";
import { ticketsActions } from "../../../../../../store/store";
import Button from "../../../../../UI/Button/Button";
import ReportInformation from "../ReportInformation";
import TaggingDrawer from "./TaggingDrawer";

const { fetchOfflineReports } = ticketsActions;

const ReportDrawer = ({ selectedOfflineReport, onClose }) => {
  const dispatch = useDispatch();
  const [isTagging, setIsTagging] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);

  const rejectReportHandler = async () => {
    setRejectLoading(true);
    const result = await rejectOfflineReport({
      param: selectedOfflineReport.id,
    });
    if (!result || result.name === "AxiosError") {
      message.error(result?.response.data.message);
    } else {
      message.success(result.data.message);

      dispatch(fetchOfflineReports());
      onClose();
    }

    setRejectLoading(false);
  };

  return (
    <Drawer
      title={"Offline Report"}
      height={"70vh"}
      placement="bottom"
      onClose={onClose}
      open={!!selectedOfflineReport}
      footer={
        <div className="flex flex-row gap-2 w-full justify-end">
          <Popconfirm
            okButtonProps={{
              className:
                "border-primary-900 bg-primary-700 hover:bg-primary-800 text-gray-100",
            }}
            title="Reject report"
            description="Reject offline report by response team?"
            onConfirm={rejectReportHandler}
          >
            <Button
              type="warning"
              text={"Reject Report"}
              loading={rejectLoading}
            />
          </Popconfirm>
          <Button
            disabled={rejectLoading}
            onClick={() => setIsTagging(true)}
            type="primary"
            text={"Tag Report"}
          />
        </div>
      }
    >
      <TaggingDrawer
        selectedOfflineReport={selectedOfflineReport}
        open={isTagging}
        onClose={() => {
          setIsTagging(false);
          onClose();
        }}
      />
      <div className="max-w-[900px] w-full mx-auto">
        <ReportInformation selectedOfflineReport={selectedOfflineReport} />
      </div>
    </Drawer>
  );
};

export default ReportDrawer;
