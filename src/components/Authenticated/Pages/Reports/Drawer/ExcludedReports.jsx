import { Drawer } from "antd";
import React from "react";
import Excluded from "../Table/Excluded";

const ExcludedReports = ({ open, onClose, reports, reload }) => {
  return (
    <Drawer
      title="Excluded Reports"
      open={open}
      onClose={onClose}
      placement="bottom"
      height={"70vh"}
    >
      <Excluded reports={reports} reload={reload} onClose={onClose} />
    </Drawer>
  );
};

export default ExcludedReports;
