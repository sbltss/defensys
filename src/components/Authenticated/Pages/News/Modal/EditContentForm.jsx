import { Button, Form, Input, Modal } from 'antd';
import React, { useState } from 'react';

const EditContentForm = ({ formEditContent }) => {
	const [isOpenEdit, setIsOpenEdit] = useState(false);
	const { TextArea } = Input;

	return (
		<div>
			<Modal
				title={<h1 className=" text-2xl font-semibold">Add Content</h1>}
				open={isOpenEdit}
				// onOk={handleOk}
				// onCancel={handleCancel}
				okButtonProps={{ style: { display: 'none' } }}
			>
				<div>
					<Form
						name="form2"
						// onFinish={onFinish}
						// onFinishFailed={onFinishFailed}
						layout="vertical"
						form={formEditContent}
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
								Add
							</Button>
						</Form.Item>
					</Form>
				</div>
			</Modal>
		</div>
	);
};

export default EditContentForm;
