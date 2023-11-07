import { Drawer, Form, Input } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ticketsActions } from "../../../../../../store/store";
import Button from "../../../../../UI/Button/Button";
const { declineTicket } = ticketsActions;

const DeclineTicketDrawer = ({ declining, setDeclining }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { declineTicketLoading, selectedPendingTicket } = useSelector(
    (state) => state.tickets
  );
  const submitFormHandler = () => {
    form.submit();
  };
  const onFinishHandler = (e) => {
    const payload = {
      param: selectedPendingTicket?.transactionNumber,
      body: {
        remarks: e.reason,
      },
      cb: () => {
        form.resetFields();
        setDeclining(false);
      },
    };
    dispatch(declineTicket(payload));
  };
  return (
    <Drawer
      height={"40vh"}
      closable={false}
      onClose={() => {
        setDeclining(false);
      }}
      open={declining}
      placement="bottom"
      title={"Reason for declining ticket"}
      footer={
        <div className="w-full flex flex-row justify-end">
          <Button
            onClick={submitFormHandler}
            type="primary"
            text="Report Ticket"
            loading={declineTicketLoading}
          />
        </div>
      }
    >
      <div className="w-1/3 h-full">
        <Form
          requiredMark="optional"
          disabled={declineTicketLoading}
          layout="vertical"
          className=""
          form={form}
          onFinish={onFinishHandler}
        >
          <Form.Item
            className="mt-4"
            label={declining === "Others" ? "Reason for declining" : "Remarks"}
            name={"reason"}
            rules={[
              {
                required: true,
                message:
                  declining === "Others"
                    ? "Please provide reason for declining ticket"
                    : "Please provide remarks for resolved ticket",
              },
            ]}
          >
            <Input.TextArea
              row="4"
              placeholder={"Please input reason for declining ticket"}
            />
          </Form.Item>
        </Form>
      </div>
    </Drawer>
  );
};

export default DeclineTicketDrawer;
