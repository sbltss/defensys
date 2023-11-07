import React from "react";
import { Helmet } from "react-helmet";
import TicketForm from "./Forms/TicketForm";
import Button from "../../../UI/Button/Button";
import { useState } from "react";
import AssignedDeptForm from "./Forms/AssignedDeptForm";
import { Descriptions, Form, message } from "antd";
import moment from "moment";
import { addReportEntry } from "../../../../store/api/ticket-api";

const ReportEntryPage = () => {
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [editDept, setEditDept] = useState(null);
  const [form] = Form.useForm();
  const onFinish = async ({ file, ticketDateTime, cb, ...e }) => {
    setLoading(true);
    const formData = new FormData();
    Object.keys(e).forEach((key) => {
      formData.append(key, e[key]);
    });
    if (file) formData.append("ticketImage", file);

    formData.append(
      "ticketDateTime",
      ticketDateTime.format("YYYY-MM-DD HH:mm:ss")
    );

    const selectedDepartmentsCopy = [
      ...selectedDepartments.map((d) => ({
        ...d,
        responseTeams: [
          ...d.responseTeams.map((rt) => ({
            ...rt,
            files: [...rt.files],
          })),
        ],
      })),
    ];
    selectedDepartmentsCopy.forEach((dept) => {
      dept.responseTeams.forEach((rt) => {
        if (rt.files && rt.files.length > 0) {
          rt.files.forEach((file) => {
            formData.append("rt;" + rt.rtAccountId, file.originFileObj);
          });
        }
        delete rt.files;
      });
    });

    formData.append("departments", JSON.stringify(selectedDepartmentsCopy));

    const result = await addReportEntry({ body: formData });
    if (result.name === "AxiosError") {
      message.error(result.response.data.message);
    } else {
      message.success(result.data.message);
      setSelectedDepartments([]);
      form.resetFields();
      if (cb) cb();
    }
    setLoading(false);
  };
  return (
    <>
      <AssignedDeptForm
        open={adding || editDept}
        onClose={() => {
          setAdding(false);
          setEditDept(null);
        }}
        selectedDepartments={selectedDepartments}
        setSelectedDepartments={setSelectedDepartments}
        editDept={editDept}
      />
      <Helmet>
        <title>Defensys | Backlogs</title>
      </Helmet>
      <div className="bg-white rounded w-full h-full shadow p-4 flex flex-col">
        <div className="border-b flex flex-row justify-between p-2">
          <span className="font-semibold text-xl">Report Entry</span>
          <Button
            text="Submit Report"
            type="primary"
            onClick={form.submit}
            loading={loading}
          />
        </div>
        <div className="w-full h-full pt-4 flex flex-row gap-8">
          <div className="flex flex-col gap-2 h-[calc(100%-80px)] overflow-y-auto overflow-x-hidden">
            <span className="font-semibold text-lg">Emergency Details</span>
            <TicketForm form={form} onFinish={onFinish} loading={loading} />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <div className="flex flex-row justify-between items-center">
              <span className="font-semibold text-lg">
                Assigned Departments
              </span>
              <Button
                text="Add Department"
                type="primary"
                onClick={() => setAdding(true)}
                disabled={loading}
              />
            </div>
            <div className="flex flex-col gap-4 overflow-y-auto">
              {selectedDepartments.map((dept) => (
                <div key={dept.departmentId}>
                  <Descriptions
                    column={6}
                    title={
                      <div className="flex flex-row justify-between items-center">
                        <span className="ml-4">{dept.name}</span>
                        <div className="flex flex-row gap-2 items-center">
                          <Button
                            text="Edit"
                            type="muted"
                            onClick={() => setEditDept(dept)}
                          />
                          <Button
                            text="Remove"
                            type="danger"
                            onClick={() =>
                              setSelectedDepartments((prev) => [
                                ...prev.filter(
                                  (r) => r.departmentId !== dept.departmentId
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
                    <Descriptions.Item span={3} label="Accepted">
                      {moment(dept.dtAccepted).format("lll")}
                    </Descriptions.Item>
                    <Descriptions.Item span={3} label="Resolved">
                      {moment(dept.dtResolved).format("lll")}
                    </Descriptions.Item>
                    <Descriptions.Item span={3} label="Persons Involved">
                      <div className="flex flex-col gap-4">
                        {dept.personsInvolved
                          ? dept.personsInvolved
                              .split(";")
                              .map((p) => <span key={p}>{p}</span>)
                          : ""}
                      </div>
                    </Descriptions.Item>
                    <Descriptions.Item span={3} label="Response Teams">
                      <div className="flex flex-col gap-4">
                        {dept.responseTeams.map((rt) => (
                          <span key={rt.rtAccountId}>{rt.name}</span>
                        ))}
                      </div>
                    </Descriptions.Item>
                    <Descriptions.Item span={6} label="Remarks">
                      {dept.remarks}
                    </Descriptions.Item>
                  </Descriptions>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportEntryPage;
