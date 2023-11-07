import { Drawer, Form, Input } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ticketsActions } from "../../../../../../store/store";
import Button from "../../../../../UI/Button/Button";
const { blockCitizen } = ticketsActions;

const BlockingDrawer = ({ blocking, setBlocking, selectedTicket }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { blockCitizenLoading, selectedPendingTicket } = useSelector(
    (state) => state.tickets
  );
  const submitFormHandler = () => {
    form.submit();
  };
  const onFinishHandler = (e) => {
    const payload = {
      accountId: selectedPendingTicket.callerId,
      reason: e.reason,
    };
    dispatch(blockCitizen(payload));
  };
  return (
    <Drawer
      height={"40vh"}
      closable={false}
      onClose={() => {
        setBlocking(false);
      }}
      open={blocking}
      placement="bottom"
      title="Block Citizen"
      footer={
        <div className="w-full flex flex-row justify-end">
          <Button
            onClick={submitFormHandler}
            type="primary"
            text="Block Citizen"
            loading={blockCitizenLoading}
          />
        </div>
      }
    >
      <div className="w-1/3 h-full">
        <Form
          requiredMark="optional"
          disabled={blockCitizenLoading}
          layout="vertical"
          className=""
          form={form}
          onFinish={onFinishHandler}
        >
          <Form.Item
            className="mt-4"
            label="Reason for blocking"
            name={"reason"}
            rules={[
              {
                required: true,
                message: "Please provide reason for blocking this citizen",
              },
            ]}
          >
            <Input.TextArea
              row="4"
              placeholder="Please input remarks for resolved ticket"
            />
          </Form.Item>
        </Form>
      </div>
    </Drawer>
  );
};

export default BlockingDrawer;
