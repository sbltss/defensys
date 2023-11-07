import { Button, Form, Input } from "antd";
import React, { useRef } from "react";

const AddText = ({ preview, setPreview, isOpenAdd, setIsOpenAdd, form2, setIsEdit, isEdit }) => {
  const { TextArea } = Input;
  const textArea = useRef(null);

  const fieldRefs = {
    value: textArea,
  };
  const onFinish = (values) => {
    // console.log(values);
    form2.resetFields();

    const index = preview.findIndex((p) => p.id === values.id);
    // console.log('index', index);
    if (index >= 0) {
      setPreview((prev) => {
        prev[index] = { ...values };
        return [...prev];
      });
    } else {
      setPreview((prev) => [...prev, { ...values, id: preview.length }]);
    }
    // setIsOpenAdd(false);
    if (isEdit) {
      setIsEdit(false);
      setIsOpenAdd(false);
      form2.resetFields();
    }
  };
  const onFinishFailed = ({ errorFields }) => {
    errorFields.reverse().forEach(({ name }) => {
      const fieldName = name[0];
      const ref = fieldRefs[fieldName];
      if (ref) {
        ref.current.focus();
      }
    });
  };

  // console.log(preview);

  return (
    <div>
      <Form name="form2" onFinish={onFinish} onFinishFailed={onFinishFailed} layout="vertical" form={form2}>
        <Form.Item name="id" hidden>
          <Input hidden />
        </Form.Item>
        <Form.Item name="type" hidden initialValue="text">
          <Input hidden />
        </Form.Item>
        <Form.Item
          label={<p className=" text-[20px] m-0 font-semibold">Input text</p>}
          className="pt-2 text-[18px]"
          name="value"
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please input text!",
            },
          ]}
        >
          <TextArea ref={textArea} rows={8} />
        </Form.Item>
        <Form.Item>
          <Button
            className=" w-full h-12 rounded-lg mt-5 sm:text-lg text-base"
            type="default"
            htmlType="submit"
            // onClick={() => message.success('Text added successfully!')}
          >
            {isEdit ? "Edit" : "Add"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddText;
