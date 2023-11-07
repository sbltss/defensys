import { Drawer } from "antd";
import React, { useEffect } from "react";
import ResponderSelection from "../Table/ResponderSelection";
import { useDispatch } from "react-redux";
import { resourcesActions } from "../../../../../../store/store";

const { updateResources } = resourcesActions;

const ResponseTeamsDrawer = ({
  open,
  onClose,
  selectedResponders,
  setSelectedResponders,
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (open) dispatch(updateResources({ toFetch: ["responseTeamsList"] }));
  }, [open]);
  return (
    <Drawer
      open={open}
      onClose={onClose}
      placement="bottom"
      height={"80vh"}
      title="Response Teams"
    >
      <ResponderSelection
        selectedResponders={selectedResponders}
        setSelectedResponders={setSelectedResponders}
      />
    </Drawer>
  );
};

export default ResponseTeamsDrawer;
