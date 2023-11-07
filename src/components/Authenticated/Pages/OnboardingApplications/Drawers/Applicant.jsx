import {
  Descriptions,
  Drawer,
  Image,
  Input,
  Modal,
  Popconfirm,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import Button from "../../../../UI/Button/Button";
import { GoogleMap, Marker } from "@react-google-maps/api";
import {
  approvedApplicant,
  rejectApplicant,
} from "../../../../../store/api/adminFn-api";

const Applicant = ({ onClose, selectedApplicant, reload }) => {
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    setRemarks("");
  }, [modalOpen]);

  const rejectHandler = async () => {
    if (remarks.trim().length === 0)
      return message.info("Reason for rejecting is required.");
    setLoading(true);
    const result = await rejectApplicant({
      body: { remarks, applicationId: selectedApplicant.id },
    });
    if (result.name === "AxiosError") {
      message.error(result.response.data.message);
    } else {
      reload();
      message.success(result.data.message);
      onClose();
    }
    setModalOpen(false);
    setLoading(false);
  };

  const approveHandler = async () => {
    setLoading(true);
    const result = await approvedApplicant({ param: selectedApplicant.id });
    if (result.name === "AxiosError") {
      message.error(result.response.data.message);
    } else {
      reload();
      message.success(result.data.message);
      onClose();
    }
    setLoading(false);
  };

  return (
    <Drawer
      title={`${[
        selectedApplicant?.firstName,
        selectedApplicant?.lastName,
      ].join(" ")} - ${selectedApplicant?.name}`}
      placement="bottom"
      height={"90vh"}
      open={!!selectedApplicant}
      onClose={onClose}
      selectedApplicant={selectedApplicant}
      footer={
        selectedApplicant?.status === 0 && (
          <div className="flex flex-row justify-end items-center gap-1">
            <Button
              text="Reject"
              type="danger"
              disabled={loading}
              onClick={() => setModalOpen(true)}
            />
            <Popconfirm
              okButtonProps={{
                loading,
              }}
              onConfirm={approveHandler}
              title="Approve application"
              description="Are you sure you want to approve this application? You won't be able to rever this."
            >
              <Button text="Approve" type="primary" disabled={loading} />
            </Popconfirm>
          </div>
        )
      }
    >
      <Modal
        title="State your reason for rejecting this application"
        open={modalOpen}
        onOk={rejectHandler}
        confirmLoading={loading}
        onCancel={() => setModalOpen(false)}
      >
        <Input value={remarks} onChange={(e) => setRemarks(e.target.value)} />
      </Modal>
      <Descriptions
        title={"Organization"}
        size="small"
        bordered
        column={1}
        className="mb-8"
      >
        <Descriptions.Item label="Name">
          {selectedApplicant?.name}
        </Descriptions.Item>
        {selectedApplicant?.website && (
          <Descriptions.Item label="Website">
            {selectedApplicant?.website}
          </Descriptions.Item>
        )}
        <Descriptions.Item label="Address">
          {selectedApplicant?.address}
        </Descriptions.Item>
        <Descriptions.Item label="Location">
          <div className="w-fill h-64">
            <GoogleMap
              mapContainerStyle={{ height: "100%", width: "100%" }}
              center={{
                lng: selectedApplicant?.longitude,
                lat: selectedApplicant?.latitude,
              }}
              zoom={13}
              options={{ mapId: "15f9baeb3890ce9f", disableDefaultUI: true }}
            >
              <Marker
                position={{
                  lat: selectedApplicant?.latitude,
                  lng: selectedApplicant?.longitude,
                }}
              />
            </GoogleMap>
          </div>
        </Descriptions.Item>
      </Descriptions>
      <Descriptions title={"Representative"} size="small" bordered column={1}>
        <Descriptions.Item label="Full name">
          {[selectedApplicant?.firstName, selectedApplicant?.lastName].join(
            " "
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Contact number">
          {selectedApplicant?.contactNumber}
        </Descriptions.Item>
        <Descriptions.Item label="Email">
          {selectedApplicant?.email}
        </Descriptions.Item>
        <Descriptions.Item label="Image">
          <Image
            height={200}
            alt={[
              selectedApplicant?.firstName,
              selectedApplicant?.lastName,
            ].join(" ")}
            src={[
              import.meta.env.VITE_BASE_URL,
              "/",
              selectedApplicant?.image,
            ].join("")}
          />
        </Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
};

export default Applicant;
