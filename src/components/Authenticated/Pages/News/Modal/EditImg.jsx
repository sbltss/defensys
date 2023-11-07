import { UploadOutlined } from '@ant-design/icons';
import { Button, Form, Image, Input, Modal, Space, Upload } from 'antd';
import React, { useState } from 'react';
import { getBase64 } from '../../../helpers/base64';

const EditImg = ({ formEditImg, isOpenEditImg, setIsOpenEditImg }) => {
	const [file, setFile] = useState(null);
	const [imgPreview, setImgPreview] = useState(null);
	const props = {
		name: 'fileList',
		accept: 'image/png, image/jpeg',
		multiple: false,
		beforeUpload: async (file) => {
			setFile(file);
			setImgPreview(await getBase64(file));
			return false;
		},
	};
	const handleCancel = () => {
		setIsOpenEditImg(false);
		setImgPreview(null);
	};
	console.log(imgPreview);
	return (
		<>
			<Modal
				title={<h1 className=" text-2xl font-semibold">Edit Content</h1>}
				open={isOpenEditImg}
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
					form={formEditImg}
				>
					<Form.Item name="id" hidden>
						<Input hidden />
					</Form.Item>
					<Form.Item name="type" hidden initialValue="image">
						<Input hidden />
					</Form.Item>
					<Form.Item
						label={<p className=" md:text-[20px] text-[18px] m-0 font-semibold">Cover image</p>}
						name="coverUrl"
						className="pt-2 sm:col-span-2 col-span-4"
						// hasFeedback
						// rules={[
						// 	{
						// 		required: true,
						// 		message: 'Please upload cover image',
						// 	},
						// ]}
					>
						<Upload
							// action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
							// listType="picture"
							// accept="image/png, image/jpeg"
							{...props}
							maxCount={1}
							multiple={false}
							// defaultFileList={fileEdit}
							showUploadList={false}
							// customRequest={(info) => {
							// 	setFileEdit([info.file]);
							// }}
							// name="coverUrl"
						>
							<Button icon={<UploadOutlined />}>Upload Cover Image</Button>
						</Upload>
					</Form.Item>

					{imgPreview && (
						<Space direction="vertical" className=" flex justify-center items-center col-span-4">
							<Image src={imgPreview}></Image>
							<Space>
								<Button
									// text="Remove"
									// disabled={onLoading}
									type="primary"
									// onClick={() => removeImg('coverUrl')}
								>
									Remove
								</Button>
							</Space>
						</Space>
					)}
				</Form>
			</Modal>
		</>
	);
};

export default EditImg;
