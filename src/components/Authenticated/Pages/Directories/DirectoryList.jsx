import {
  Form,
  Input,
  Popconfirm,
  Select,
  Table,
  Typography,
  message,
} from "antd";
import React, { useState } from "react";
import {
  addDirectory,
  updateDirectory,
} from "../../../../store/api/resources-api";
import Button from "../../../UI/Button/Button";
import MapDrawer from "./MapDrawer";
import { useWatch } from "antd/es/form/Form";

const DirectoryList = ({ directories, setDirectories, cityId }) => {
  const [addLoading, setAddLoading] = useState(false);
  const [editingKey, setEditingKey] = useState("");
  const [adding, setAdding] = useState(false);
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [mapOpen, setMapOpen] = useState(false);
  const [mapOpenAdd, setMapOpenAdd] = useState(false);

  const addType = useWatch("type", form);

  const isEditing = (record) => record.directoryId === editingKey;
  const edit = (record) => {
    form2.setFieldsValue(record);
    setEditingKey(record.directoryId);
  };

  const addDirectoryHandler = async (e) => {
    setAddLoading(true);
    const request = await addDirectory({ body: { ...e, cityId } });
    if (request.name === "AxiosError")
      message.error(request.response.data.message);
    else {
      message.success(request.data.message);
      setDirectories((prevstate) => [...prevstate, request.data.data]);
      setAdding(false);
      form.resetFields();
    }
    form.resetFields();
    setAddLoading(false);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const row = await form2.validateFields();
      if (row.type !== "EVAC") {
        delete row.latitude;
        delete row.longitude;
      }
      const request = await updateDirectory({ body: row, param: key });
      if (request.name === "AxiosName")
        message.error(request.response.data.message);
      else {
        setDirectories((prevState) =>
          prevState.map((d) => {
            if (d.directoryId === key) return { ...d, ...request.data.data };
            return d;
          })
        );
        message.success(request.data.message);
        cancel();
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    if (title === "Coordinates")
      return (
        <td {...restProps}>
          {editing &&
          directories.find((d) => d.directoryId == editingKey)?.type ===
            "EVAC" ? (
            <>
              <a onClick={() => setMapOpen(true)} className="text-blue-500">
                Open map
              </a>
              <Form.Item
                name={"latitude"}
                style={{
                  margin: 0,
                }}
                rules={[
                  {
                    required: true,
                    message: `Please Input Latitude!`,
                  },
                ]}
              >
                <Input placeholder="Latitude" readOnly />
              </Form.Item>
              <Form.Item
                name={"longitude"}
                style={{
                  margin: 0,
                }}
                rules={[
                  {
                    required: true,
                    message: `Please Input Longitude!`,
                  },
                ]}
              >
                <Input placeholder="Longitude" readonly />
              </Form.Item>
            </>
          ) : (
            children
          )}
        </td>
      );
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            {inputType}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };
  const columns = [
    {
      title: "Type",
      dataIndex: "type",
      editable: true,
      render: (d) => {
        if (d === "EVAC") return "EVACUATION";
        return d;
      },
    },
    {
      title: "Label",
      dataIndex: "label",
      editable: true,
    },
    {
      title: "Value",
      dataIndex: "value",
      editable: true,
    },
    {
      title: "Coordinates",
      dataIndex: null,
      editable: true,
      render: (data) => (
        <>
          {data.type !== "EVAC" ? (
            <span>-</span>
          ) : (
            <div className="flex flex-col gap-1">
              <span>
                Latitude: <span>{data.latitude}</span>
              </span>
              <span>
                Longitude: <span>{data.longitude}</span>
              </span>
            </div>
          )}
        </>
      ),
    },
    {
      title: "Operation",
      dataIndex: null,
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.directoryId)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm
              title="Sure to cancel?"
              onConfirm={cancel}
              okButtonProps={{
                className:
                  "border-primary-900 bg-primary-700 hover:bg-primary-800 text-gray-100",
              }}
            >
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== "" || adding}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType:
          col.dataIndex === "type" ? (
            <Select placeholder="Select type">
              <Select.Option value={"SMS"}>SMS</Select.Option>
              <Select.Option value={"CALL"}>CALL</Select.Option>
              <Select.Option value={"EVAC"}>Evacuation</Select.Option>
            </Select>
          ) : col.title === "Coordinates" ? null : (
            <Input />
          ),
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <div className="flex flex-col gap-2">
      <MapDrawer
        form={mapOpen ? form2 : form}
        mapOpen={mapOpen || mapOpenAdd}
        setMapOpen={mapOpen ? setMapOpen : setMapOpenAdd}
      />
      <span className="text-xl font-semibold text-gray-800">Directories</span>
      <div className="flex flex-row justify-start gap-2 items-center">
        {!adding && (
          <Button
            text="Add a directory"
            type="muted"
            onClick={() => setAdding(true)}
            disabled={editingKey}
          />
        )}
        {adding && (
          <>
            <Form
              className="flex flex-row justify-between gap-2"
              layout="vertical"
              requiredMark={"optional"}
              form={form}
              onFinish={addDirectoryHandler}
            >
              <Form.Item
                name="type"
                label="Type"
                rules={[
                  {
                    required: true,
                    message: "Please select type.",
                  },
                ]}
              >
                <Select placeholder="Select type">
                  <Select.Option value={"SMS"}>SMS</Select.Option>
                  <Select.Option value={"CALL"}>CALL</Select.Option>
                  <Select.Option value={"EVAC"}>Evacuation</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="label"
                label="Label"
                rules={[
                  {
                    required: true,
                    message: "Please enter label",
                  },
                ]}
              >
                <Input placeholder="Please enter label" />
              </Form.Item>
              <Form.Item
                name="value"
                label="Value"
                rules={[
                  {
                    required: true,
                    message: "Please enter value",
                  },
                ]}
              >
                <Input placeholder="Please enter value" />
              </Form.Item>
              {addType === "EVAC" && (
                <>
                  <Form.Item
                    name="latitude"
                    label="Latitude"
                    rules={[
                      {
                        required: true,
                        message: "Please enter latitude",
                      },
                    ]}
                  >
                    <Input placeholder="Please enter latitude" />
                  </Form.Item>
                  <Form.Item
                    name="longitude"
                    label="Longitude"
                    rules={[
                      {
                        required: true,
                        message: "Please enter longitude",
                      },
                    ]}
                  >
                    <Input placeholder="Please enter longitude" />
                  </Form.Item>
                </>
              )}
            </Form>
            {addType === "EVAC" && (
              <Button
                text="Open Map"
                type="warning"
                onClick={() => setMapOpenAdd(true)}
                disabled={addLoading}
              />
            )}
            <Button
              text="Cancel"
              type="muted"
              onClick={() => {
                setAdding(false);
                form.resetFields();
              }}
              disabled={addLoading}
            />
            <Button
              text="Add"
              type="primary"
              onClick={form.submit}
              loading={addLoading}
            />
          </>
        )}
      </div>
      <div className="grid grid-flow-row">
        <Form form={form2} component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            dataSource={directories}
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={{
              onChange: cancel,
            }}
            rowKey={"directoryId"}
          />
        </Form>
      </div>
    </div>
  );
};

export default DirectoryList;
