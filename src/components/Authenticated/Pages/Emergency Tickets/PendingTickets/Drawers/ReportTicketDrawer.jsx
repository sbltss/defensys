import { Drawer, Form, Input } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ticketsActions } from "../../../../../../store/store";
import Button from "../../../../../UI/Button/Button";
const { reportTicket } = ticketsActions;

const ReportTicketDrawer = ({ reporting, setReporting, selectedTicket }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { reportTicketLoading, selectedPendingTicket } = useSelector(
    (state) => state.tickets
  );
  const submitFormHandler = () => {
    form.submit();
  };
  const onFinishHandler = (e) => {
    const payload = {
      param: selectedPendingTicket?.transactionNumber,
      body: {
        reason: e.reason,
        status: reporting === "Others" ? -1 : 2,
      },
    };
    dispatch(reportTicket(payload));
  };
  return (
    <Drawer
      height={"40vh"}
      closable={false}
      onClose={() => {
        setReporting(false);
      }}
      open={reporting}
      placement="bottom"
      title={
        reporting === "Others"
          ? "Reason for reporting ticket"
          : "Remarks for resolved ticket"
      }
      footer={
        <div className="w-full flex flex-row justify-end">
          <Button
            onClick={submitFormHandler}
            type="primary"
            text="Report Ticket"
            loading={reportTicketLoading}
          />
        </div>
      }
    >
      <div className="w-1/3 h-full">
        <Form
          requiredMark="optional"
          disabled={reportTicketLoading}
          layout="vertical"
          className=""
          form={form}
          onFinish={onFinishHandler}
        >
          <Form.Item
            className="mt-4"
            label={reporting === "Others" ? "Reason for reporting" : "Remarks"}
            name={"reason"}
            rules={[
              {
                required: true,
                message:
                  reporting === "Others"
                    ? "Please provide reason for reporting ticket"
                    : "Please provide remarks for resolved ticket",
              },
            ]}
          >
            <Input.TextArea
              row="4"
              placeholder={
                reporting === "Others"
                  ? "Please input reason for reporting ticket"
                  : "Please input remarks for resolved ticket"
              }
            />
          </Form.Item>
        </Form>
      </div>
    </Drawer>
  );
};

export default ReportTicketDrawer;
