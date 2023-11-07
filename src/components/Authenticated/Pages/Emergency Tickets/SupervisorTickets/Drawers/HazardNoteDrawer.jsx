import { Drawer, Form, Input } from "antd";
import React from "react";
import Button from "../../../../../UI/Button/Button";
import { useEffect } from "react";

const HazardNoteDrawer = ({
  setAsReportOfTheDay,
  selectedTicket,
  setSelectedTicket,
  loading,
}) => {
  const onClose = () => {
    setSelectedTicket(null);
  };
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
  }, [selectedTicket]);

  return (
    <>
      <Drawer
        title={"Set as report of the day"}
        height={"40vh"}
        placement="bottom"
        onClose={onClose}
        open={selectedTicket}
        destroyOnClose={true}
        footer={
          <div className="flex flex-row justify-end">
            <Button
              loading={loading}
              type="primary"
              text="Submit"
              onClick={() => form.submit()}
            />
          </div>
        }
      >
        <div className="max-w-[900px] w-full">
          <Form
            form={form}
            labelCol={{
              span: 5,
            }}
            wrapperCol={{
              span: 24,
            }}
            labelAlign="left"
            requiredMark="optional"
            onFinish={(e) => {
              setAsReportOfTheDay(selectedTicket.transactionNumber, e.note);
            }}
          >
            <Form.Item
              label="Hazard Note"
              name="note"
              rules={[
                {
                  required: true,
                  message: "Input emergency hazard note",
                },
                {
                  max: 500,
                  message: "Maximum of 500 characters only",
                },
              ]}
            >
              <Input.TextArea
                placeholder="Input emergency hazard note"
                rows={4}
              />
            </Form.Item>
          </Form>
        </div>
      </Drawer>
    </>
  );
};

export default HazardNoteDrawer;
