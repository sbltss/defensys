import { Button, Form, Input, Modal } from 'antd';
import React from 'react';

const EditText = ({ formEditText, isOpenEditText, setIsOpenEditText }) => {
	const { TextArea } = Input;

	const handleCancel = () => {
		setIsOpenEditText(false);
	};

	return (
		<>
			<Modal
				title={<h1 className=" text-2xl font-semibold">Edit Content</h1>}
				open={isOpenEditText}
				// onOk={handleOk}
				onCancel={handleCancel}
				okButtonProps={{ style: { display: 'none' } }}
			>
				<Form
					name="formEditContent"
					// onFinish={onFinish}
					// onFinishFailed={onFinishFailed}
					layout="vertical"
					form={formEditText}
				>
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
								message: 'Please input text!',
							},
						]}
					>
						<TextArea
							// ref={textArea}
							rows={8}
						/>
					</Form.Item>
					<Form.Item>
						<Button
							className=" w-full h-12 rounded-lg mt-5 sm:text-lg text-base"
							type="primary"
							htmlType="submit"
							// onClick={() => message.success('Text added successfully!')}
						>
							Edit
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};

export default EditText;
