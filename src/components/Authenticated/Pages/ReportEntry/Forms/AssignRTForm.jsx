import { DatePicker, Drawer, Form, Image, Input, Select, Upload } from "antd";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { getBase64 } from "../../../../../helpers/base64";
import Button from "../../../../UI/Button/Button";
import dayjs from "dayjs";

const AssignRTForm = ({
  open,
  onClose,
  fields,
  selectedResponseTeams,
  setSelectedResponseTeams,
  selectedRt,
}) => {
  const [form] = Form.useForm();
  const { responseTeamsList } = useSelector((state) => state.resources);
  const [fileList, setFileList] = useState([]);
  const [preview, setPreview] = useState(null);

  const onChange = async (e) => {
    if (e.file.status === "removed") {
      setFileList((prevState) => [
        ...prevState.filter((file) => file.uid != e.file.uid),
      ]);
    } else {
      const base64 = await getBase64(e.file.originFileObj);
      setFileList((prevState) => [
        ...prevState,
        {
          ...e.file,
          status: "done",
          base64: base64,
        },
      ]);
    }
  };
  const onPreview = async (file) => {
    setPreview(file);
  };

  const onFinish = (e) => {
    const rt = responseTeamsList.find((rt) => rt.accountId == e.rtAccountId);
    const body = {
      ...e,
      // ...rt,
      dtAccepted: e.dtAccepted.format("YYYY-MM-DD HH:mm:ss"),
      dtArrived: e.dtArrived.format("YYYY-MM-DD HH:mm:ss"),
      dtReported: e.dtReported.format("YYYY-MM-DD HH:mm:ss"),
      files: fileList,
      name: [rt.firstName, rt.lastName, ` - ${rt.type}`].join(" "),
    };

    if (selectedRt) {
      setSelectedResponseTeams((prevState) => [
        ...prevState.map((r) => {
          if (r.rtAccountId === e.rtAccountId) return body;
          else r;
        }),
      ]);
    } else setSelectedResponseTeams((prevState) => [...prevState, body]);

    onClose();
    form.resetFields();
    setFileList([]);
    setPreview(null);
  };

  useEffect(() => {
    if (selectedRt) {
      const { files, dtAccepted, dtArrived, dtReported, ...fields } =
        selectedRt;
      form.setFieldsValue({
        ...fields,
        dtAccepted: dayjs(dtAccepted),
        dtArrived: dayjs(dtAccepted),
        dtReported: dayjs(dtReported),
      });
      setFileList(selectedRt.files);
    }
  }, [selectedRt]);

  useEffect(() => {
    if (!open) {
      form.resetFields();
      setFileList([]);
      setPreview(null);
    }
  }, [open]);
  return (
    <Drawer
      title="Add assigned response team"
      open={open}
      onClose={onClose}
      placement="bottom"
      height={"70vh"}
      extra={
        <div className="flex flex-row justify-center items-center">
          <Button
            text={selectedRt ? "Edit Response Team" : "Add Response Team"}
            type="primary"
            onClick={form.submit}
          />
        </div>
      }
    >
      <div className="max-w-[900px]">
        <Form
          requiredMark="optional"
          className=""
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
          <span className="font-semibold text-lg">Response Team Report</span>
          <Form.Item
            label="Response team"
            name="rtAccountId"
            rules={[
              {
                required: true,
                message: "Please select response team to assign",
              },
            ]}
          >
            <Select
              placeholder="Select response team to assign"
              disabled={selectedRt}
            >
              {responseTeamsList
                .filter(
                  (rt) =>
                    (!selectedResponseTeams
                      .map((sd) => sd.accountId)
                      .includes(rt.accountId) ||
                      selectedRt) &&
                    !rt.isDeleted &&
                    fields?.departmentId == rt.departmentId
                )
                .map((d) => (
                  <Select.Option value={d.accountId} key={d.accountId}>
                    {[d.firstName, d.lastName, ` - ${d.type}`].join(" ")}
                  </Select.Option>
                ))}
            </Select>
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
            label="Date time arrived"
            name={"dtArrived"}
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
            label="Date time reported"
            name={"dtReported"}
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
          <Form.Item label="Reported Images">
            <Upload
              multiple={false}
              customRequest={(e) => {}}
              listType="picture-card"
              fileList={fileList}
              onChange={onChange}
              onPreview={onPreview}
              accept={"image/*"}
            >
              {fileList.length < 5 && "+ Upload"}
            </Upload>
          </Form.Item>
        </Form>
      </div>
      <Image
        width={200}
        style={{
          display: "none",
        }}
        src={preview?.base64}
        preview={{
          visible: preview,
          src: preview?.base64,
          onClose: () => setPreview(null),
        }}
      />
    </Drawer>
  );
};

export default AssignRTForm;
