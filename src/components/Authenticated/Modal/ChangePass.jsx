import { Col, Form, Input, Modal, Row } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../../store/store";
const { dismissChangePassModal, changePass } = authActions;

const ChangePass = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { changePassModal, changePassLoading } = useSelector(
    (state) => state.auth
  );
  const handleOk = (e) => {
    dispatch(changePass({ body: { password: e.password } }));
  };
  return (
    <Modal
      title="Weak Password"
      open={changePassModal}
      onOk={form.submit}
      okText="Change Password"
      okButtonProps={{
        className:
          "border-primary-900 bg-primary-700 hover:bg-primary-800 text-gray-100",
      }}
      confirmLoading={changePassLoading}
      onCancel={() => dispatch(dismissChangePassModal())}
      cancelText="Dismiss"
    >
      <p className="mb-4 text-lg">
        {
          "You are still using the default password. Would you like to change password?"
        }
      </p>
      <Form
        layout="vertical"
        requiredMark={"optional"}
        form={form}
        onFinish={handleOk}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              className="mb-1"
              name="password"
              label="New Password"
              rules={[
                {
                  required: true,
                  message: "Please enter password",
                },

                {
                  min: 5,
                  message: "Password greater than 5 characters is required",
                },
              ]}
              hasFeedback
            >
              <Input.Password
                type={"password"}
                allowClear
                placeholder="Please enter password"
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              hasFeedback
              name="confirmPassword"
              label="Confirm Password"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "Please confirm password",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }

                    return Promise.reject(
                      new Error(
                        "The two passwords that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                type={"password"}
                allowClear
                placeholder="Please confirm password"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ChangePass;
