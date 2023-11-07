import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  DatePicker,
  Descriptions,
  Drawer,
  Form,
  Image,
  Input,
  Select,
} from "antd";
import React from "react";
import { useSelector } from "react-redux";
import Button from "../../../../UI/Button/Button";
import { useState } from "react";
import AssignRTForm from "./AssignRTForm";
import moment from "moment";
import { useEffect } from "react";
import dayjs from "dayjs";

const AssignedDeptForm = ({
  open,
  onClose,
  selectedDepartments,
  setSelectedDepartments,
  editDept,
}) => {
  const [adding, setAdding] = useState(false);
  const [editRt, setEditRt] = useState(null);
  const [selectedResponseTeams, setSelectedResponseTeams] = useState([]);
  const { departmentList } = useSelector((state) => state.resources);
  const [form] = Form.useForm();
  const fields = Form.useWatch(null, form);
  const onFinish = ({
    departmentId,
    remarks,
    dtAccepted,
    dtResolved,
    personsInvolved,
  }) => {
    const selectedDept = departmentList.find(
      (d) => d.accountId === departmentId
    );
    const body = {
      departmentId,
      remarks,
      dtAccepted: dtAccepted.format("YYYY-MM-DD HH:mm:ss"),
      dtResolved: dtResolved.format("YYYY-MM-DD HH:mm:ss"),
      personsInvolved: personsInvolved ? personsInvolved.join(";") : "",
      deptType: selectedDept.deptType,
      name: selectedDept.name,
      responseTeams: selectedResponseTeams,
    };
    if (editDept) {
      setSelectedDepartments((prev) => [
        ...prev.map((p) => {
          if (p.departmentId === departmentId) return body;
          else return p;
        }),
      ]);
    } else {
      setSelectedDepartments((prev) => [...prev, body]);
    }
    onClose();
    form.resetFields();
    setSelectedResponseTeams([]);
  };

  useEffect(() => {
    if (!open) {
      form.resetFields();
      setSelectedResponseTeams([]);
    }
  }, [open]);

  useEffect(() => {
    if (editDept) {
      const {
        dtAccepted,
        dtResolved,
        selectedResponseTeams,
        personsInvolved,
        ...fields
      } = editDept;
      form.setFieldsValue({
        ...fields,
        dtAccepted: dayjs(dtAccepted),
        dtResolved: dayjs(dtResolved),
        personsInvolved: personsInvolved.split(";"),
      });
      setSelectedResponseTeams(selectedResponseTeams);
    }
  }, [editDept]);
  return (
    <Drawer
      title="Add assigned department"
      open={open}
      onClose={onClose}
      placement="bottom"
      height={"90vh"}
      extra={
        <div className="flex flex-row justify-center items-center">
          <Button
            text={editDept ? "Edit Department" : "Add Department"}
            type="primary"
            onClick={form.submit}
          />
        </div>
      }
    >
      <AssignRTForm
        open={adding || editRt}
        onClose={() => {
          setAdding(false);
          setEditRt(null);
        }}
        selectedRt={editRt}
        fields={fields}
        selectedResponseTeams={selectedResponseTeams}
        setSelectedResponseTeams={setSelectedResponseTeams}
      />
      <div className="w-full flex flex-row gap-8">
        <Form
          requiredMark="optional"
          className="w-full"
          form={form}
          onFinish={onFinish}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          labelAlign="left"
        >
          <span className="font-semibold text-lg">Department Report</span>
          <Form.Item
            label="Departments"
            name="departmentId"
            rules={[
              {
                required: true,
                message: "Please select department to assign",
              },
            ]}
          >
            <Select
              placeholder="Select department to assign"
              disabled={selectedResponseTeams.length > 0 || editDept}
            >
              {departmentList
                .filter(
                  (d) =>
                    (!selectedDepartments
                      .map((sd) => sd.departmentId)
                      .includes(d.accountId) ||
                      editDept) &&
                    !d.isDeleted
                )
                .map((d) => (
                  <Select.Option value={d.accountId} key={d.accountId}>
                    {d.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Remarks"
            name={"remarks"}
            rules={[
              {
                required: true,
                message: "Please provide a detailed report for this emergency",
              },
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            label="Date time accepted"
            name={"dtAccepted"}
            rules={[
              {
                required: true,
                message: "Please select a date time",
              },
            ]}
          >
            <DatePicker showTime format={"YYYY-MM-DD HH:mm:ss"} />
          </Form.Item>
          <Form.Item
            label="Date time resolved"
            name={"dtResolved"}
            rules={[
              {
                required: true,
                message: "Please select a date time",
              },
            ]}
          >
            <DatePicker showTime format={"YYYY-MM-DD HH:mm:ss"} />
          </Form.Item>
          <Form.List name={"personsInvolved"}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Form.Item
                    key={key}
                    label={key === 0 ? "Persons Involved" : " "}
                    {...restField}
                    name={[name]}
                    rules={[
                      {
                        required: true,
                        message:
                          "Please input name of a person involved or remove the field",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Person involved"
                      suffix={
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      }
                    />
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button
                    text="Add Person Involved"
                    type="muted"
                    onClick={(e) => {
                      e.preventDefault();
                      add();
                    }}
                    block
                    icon={<PlusOutlined />}
                  />
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>

        <div className="w-full">
          <div className="flex flex-row justify-between items-center">
            <span className="font-semibold text-lg">
              Assigned Response Teams
            </span>
            <Button
              text="Add Response Team"
              type="primary"
              onClick={() => setAdding(true)}
              disabled={!fields?.departmentId}
            />
          </div>
          <div className="mt-4 overflow-y-auto">
            {selectedResponseTeams.map((rt) => (
              <div key={rt.rtAccountId}>
                <Descriptions
                  column={6}
                  title={
                    <div className="flex flex-row justify-between items-center">
                      <span className="ml-4">{rt.name}</span>
                      <div className="flex flex-row gap-2 items-center">
                        <Button
                          text="Edit"
                          type="muted"
                          onClick={() => setEditRt(rt)}
                        />
                        <Button
                          text="Remove"
                          type="danger"
                          onClick={() =>
                            setSelectedResponseTeams((prev) => [
                              ...prev.filter(
                                (r) => r.rtAccountId !== rt.rtAccountId
                              ),
                            ])
                          }
                        />
                      </div>
                    </div>
                  }
                  bordered
                  size="small"
                  layout="vertical"
                >
                  <Descriptions.Item span={2} label="Accepted">
                    {moment(rt.dtAccepted).format("lll")}
                  </Descriptions.Item>
                  <Descriptions.Item span={2} label="Arrived">
                    {moment(rt.dtArrived).format("lll")}
                  </Descriptions.Item>
                  <Descriptions.Item span={2} label="Reported">
                    {moment(rt.dtReported).format("lll")}
                  </Descriptions.Item>
                  <Descriptions.Item span={3} label="Remarks">
                    {rt.remarks}
                  </Descriptions.Item>
                  <Descriptions.Item span={3} label="Images">
                    {rt.files.length === 0 ? (
                      <span>No file included</span>
                    ) : (
                      <div className="flex flex-row flex-wrap gap-4">
                        {rt.files.map((file) => (
                          <Image
                            key={file.uid}
                            height={100}
                            width={100}
                            src={file.base64}
                          />
                        ))}
                      </div>
                    )}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default AssignedDeptForm;
