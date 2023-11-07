import { Descriptions, Drawer, Image, Input, Modal, Tag } from "antd";
import React, { useEffect, useState } from "react";
import Button from "../../../../../UI/Button/Button";
import moment from "moment";
import { searchFunction } from "../../../../../../helpers/searchFunction";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "ant-table-extensions";
import { resourcesActions } from "../../../../../../store/store";
import {
  approveBatchSubscription,
  rejectedBatchSubscription,
} from "../../../../../../store/api/subscription-api";

const { updateResources } = resourcesActions;

const BatchSubscription = ({ selectedSubscription, onClose, reload }) => {
  const { departmentList } = useSelector((state) => state.resources);
  const dispatch = useDispatch();
  const { responseTeamsList } = useSelector((state) => state.resources);
  const [mode, setMode] = useState(null);
  const {
    dateCreated,
    status,
    batchId,
    description,
    responders,
    rate,
    dateUpdated,
    departmentId,
    proof,
  } = selectedSubscription || {};
  const [loading, setLoading] = useState(false);
  const [remarks, setRemarks] = useState("");

  const verifyHandler = async () => {
    let result;
    const payload = {
      body: { remarks },
      param: batchId,
    };
    if (mode === "reject") {
      result = await rejectedBatchSubscription(payload);
    } else {
      result = await approveBatchSubscription(payload);
    }
    if (result.name === "AxiosError") {
      message.error(result.response.data.message);
    } else {
      setMode(null);
      setRemarks("");
      onClose();
      reload();
      message.success(result.data.message);
    }
  };

  useEffect(() => {
    if (!!selectedSubscription) {
      dispatch(updateResources({ toFetch: ["responseTeamsList"] }));
    }
  }, [selectedSubscription]);

  return (
    <Drawer
      open={!!selectedSubscription}
      onClose={onClose}
      placement="bottom"
      height={"80vh"}
      title="Batch Subscription"
      footer={
        <div className="flex items-center justify-end">
          {status === "verification" && (
            <>
              <Button
                text="Reject"
                type="danger"
                onClick={() => setMode("reject")}
              />
              <Button
                text="Approve"
                type="primary"
                onClick={() => setMode("approve")}
              />
            </>
          )}
        </div>
      }
    >
      <Modal
        onOk={verifyHandler}
        open={!!mode}
        onCancel={() => setMode(null)}
        title={mode === "reject" ? "Reject payment" : "Approve payment"}
      >
        <Input
          placeholder="Input your remarks"
          onChange={(e) => setRemarks(e.target.value)}
        />
      </Modal>
      <div className="w-full flex flex-row gap-8">
        <div className="w-1/2">
          <Descriptions
            size="small"
            bordered
            title="Subscription Details"
            column={1}
          >
            <Descriptions.Item label="Department">
              {departmentList.find((e) => e.accountId === departmentId)?.name}
            </Descriptions.Item>
            <Descriptions.Item label="Date submitted">
              {moment(dateCreated).format("LLL")}
            </Descriptions.Item>
            {status != "verification" && (
              <Descriptions.Item label={`Date ${status}`}>
                {moment(dateUpdated).format("LLL")}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Status">
              {status === "verification" ? (
                <Tag color="orange">For Verification</Tag>
              ) : status === "approved" ? (
                <Tag color="green">Approved</Tag>
              ) : (
                <Tag color="red">Rejected</Tag>
              )}
            </Descriptions.Item>

            <Descriptions.Item label="Plan details">
              {description}
            </Descriptions.Item>

            <Descriptions.Item label="Rate per responder">
              {`${rate} PHP`}
            </Descriptions.Item>

            <Descriptions.Item label="Number of responders">
              {responders?.length}
            </Descriptions.Item>

            <Descriptions.Item label="Total cost">
              {`${responders?.length * rate} PHP`}
            </Descriptions.Item>

            <Descriptions.Item label="Proof of payment">
              <Image
                alt="proofOfPayment"
                src={[import.meta.env.VITE_BASE_URL, proof].join("/")}
              />
            </Descriptions.Item>
          </Descriptions>
        </div>
        <div className="w-1/2">
          <div className="w-full flex justify-between items-center">
            <span className="font-semibold text-base">Selected Responders</span>
          </div>
          <Table
            searchableProps={{
              searchFunction: searchFunction,
            }}
            pagination={{
              showSizeChanger: true,
              defaultPageSize: 10,
              pageSizeOptions: [10, 20, 50, 100],
            }}
            rowKey={"accountId"}
            columns={[
              {
                title: "Name",
                dataIndex: null,
                render: (d) => `${d.firstName} ${d.lastName}`,
              },
              {
                title: "Type",
                dataIndex: "type",
              },
              {
                title: "Mobile Number",
                dataIndex: "contactNumber",
              },
              {
                title: "Email",
                dataIndex: "email",
              },
            ]}
            dataSource={responseTeamsList.filter((e) =>
              responders?.includes(e.accountId)
            )}
            scroll={{ y: "45vh", x: "100%" }}
          />
        </div>
      </div>
    </Drawer>
  );
};

export default BatchSubscription;
