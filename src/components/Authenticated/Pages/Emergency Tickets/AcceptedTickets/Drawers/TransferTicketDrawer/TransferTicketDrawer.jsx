import { Drawer, Form, Input, Select, message } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { transferTicket } from "../../../../../../../store/api/ticket-api";
import { resourcesActions } from "../../../../../../../store/store";
import Button from "../../../../../../UI/Button/Button";
const { fetchResources } = resourcesActions;

const TransferTicketDrawer = ({ ticket, open, closeDrawer }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const resources = useSelector((state) => state.resources);
  const { agentList, supervisorList } = resources;

  useEffect(() => {
    const toFetch = ["agentList", "supervisorList"];

    dispatch(
      fetchResources({
        existing: resources,
        toFetch,
      })
    );
  }, [dispatch]);

  const transferTicketHandler = async (citizen) => {
    let messageLoading;
    messageLoading = message.loading("Requesting ticket transfer...");

    const request = await transferTicket({
      body: {
        transferTo: citizen.accountId,
        transactionNumber: ticket.transactionNumber,
        remarks: citizen.remarks,
      },
    });
    messageLoading();
    if (!request || request.name === "AxiosError") {
      message.error(request.response.data.message);
    } else {
      message.success(request.data.message);
      closeDrawer();
    }
  };

  return (
    <Drawer
      height={"40vh"}
      onClose={closeDrawer}
      open={open}
      placement="bottom"
      title="Transfer ticket"
      footer={
        <div className="flex flex-row justify-end">
          <Button
            text="Transfer Ticket"
            type="primary"
            onClick={() => form.submit()}
          />
        </div>
      }
    >
      <div className="max-w-[900px]">
        <Form
          requiredMark="optional"
          className=""
          form={form}
          onFinish={transferTicketHandler}
          labelCol={{
            span: 5,
          }}
          wrapperCol={{
            span: 24,
          }}
          labelAlign="left"
        >
          <Form.Item
            label="Transfer ticket to"
            name="accountId"
            rules={[
              {
                required: true,
                message: "Please select an dispatcher",
                // message: "Please select an agent or supervisor",
              },
            ]}
          >
            {/* <Select placeholder="Select agent/supervisor"> */}
            <Select placeholder="Select dispatcher">
              {/* <Select.Option value="agent" disabled>
                AGENTS
              </Select.Option> */}
              {agentList.map((agent) => {
                if (agent.accountId === currentUser.accountId) return null;
                return (
                  <Select.Option value={agent.accountId} key={agent.accountId}>
                    {[agent.firstName, agent.lastName].join(" ")}
                  </Select.Option>
                );
              })}
              {/* <Select.Option value="supervisor" disabled>
                SUPERVISORS
              </Select.Option>
              {supervisorList.map((supervisor) => {
                if (supervisor.accountId === currentUser.accountId) return null;
                return (
                  <Select.Option
                    value={supervisor.accountId}
                    key={supervisor.accountId}
                  >
                    {[supervisor.firstName, supervisor.lastName].join(" ")}
                  </Select.Option>
                );
              })} */}
            </Select>
          </Form.Item>
          <Form.Item
            label="Remarks"
            name="remarks"
            rules={[
              {
                required: true,
                message: "Please input remarks",
              },
            ]}
          >
            <Input.TextArea
              placeholder="Provide remarks/notes for the transfer"
              rows={4}
            />
          </Form.Item>
        </Form>
      </div>
    </Drawer>
  );
};

export default TransferTicketDrawer;
