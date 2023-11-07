import { InboxOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Space, Upload } from 'antd';
import React, { useState } from 'react';
import { getBase64 } from '../../../helpers/base64';

const EditVid = ({ setIsOpenEditVid, isOpenEditVid }) => {
	const [videoPreview, setVideoPreview] = useState(null);
	const [file, setFile] = useState(null);
	const { Dragger } = Upload;

	const handleCancel = () => {
		setIsOpenEditVid(false);
	};

	const props = {
		name: 'fileList',
		accept: 'video/mp4, video/quicktime',
		// accept: 'image/png, image/jpeg',
		multiple: false,
		beforeUpload: async (file) => {
			setFile(file);
			setVideoPreview(await getBase64(file));
			return false;
		},
	};
	return (
		<>
			<Modal
				title={<h1 className=" text-2xl font-semibold">Edit Content</h1>}
				open={isOpenEditVid}
				// onOk={handleOk}
				onCancel={handleCancel}
				okButtonProps={{ style: { display: 'none' } }}
			>
				<Form
					className=" max-w-[700px] mx-auto"
					// onFinish={onFinish}
					// onFinishFailed={onFinishFailed}
					layout="vertical"
					// form={form}
				>
					<Form.Item name="id" hidden>
						<Input hidden />
					</Form.Item>
					<Form.Item name="type" hidden initialValue="video">
						<Input hidden />
					</Form.Item>
					<Form.Item
						label={<p className=" text-[20px] m-0 font-semibold">Upload video</p>}
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
						{!videoPreview && (
							<Dragger {...props}>
								<p className="ant-upload-drag-icon">
									<InboxOutlined />
								</p>
								<p className="ant-upload-text">Click or drag video file to this area to upload</p>
								<p className="ant-upload-hint">
									To upload your Valid ID / Personal Document, drag and drop your image file in the
									drop zone
								</p>
							</Dragger>
						)}
					</Form.Item>

					{videoPreview && (
						<Space direction="vertical" className=" flex justify-center items-center">
							<video
								className=" w-full"
								// autoPlay={true}
								loop={true}
								// muted={true}
								controls={true}
								src={videoPreview}
							/>

							<Space>
								<Button
									// text="Remove"
									// disabled={onLoading}
									type="primary"
									// onClick={removeVid}
								>
									Remove
								</Button>
								<Button
									// text="Upload"
									// loading={onLoading}
									htmlType="submit"
									type="primary"
									// onClick={() => onUploadDocument(file)}
								>
									Add
								</Button>
							</Space>
						</Space>
					)}
				</Form>
			</Modal>
		</>
	);
};

export default EditVid;
