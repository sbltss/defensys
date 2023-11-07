import { Button, Col, Form, Input, Radio, Row, message } from 'antd';
import React, { useRef, useState } from 'react';
import { fontSizeOpt, fontWeightOpt, textAlignOpt, textHeightOpt } from '../../../constants/static';

const AddTextForm = ({ preview, setPreview, form, formRef }) => {
	// const [textStyle, setTextStyle] = useState('');
	const [text, setText] = useState('');
	const [size, setSize] = useState('');
	const [weight, setWeight] = useState('');
	const [align, setAlign] = useState('');
	const [height, setHeight] = useState('');
	// const [preview, setPreview] = useState([]);

	const { TextArea } = Input;

	const fontSize = useRef(null);
	const fontWeight = useRef(null);
	const textAlign = useRef(null);
	const textHeight = useRef(null);

	const fieldRefs = {
		fontSize: fontSize,
		fontWeight: fontWeight,
		textAlign: textAlign,
		textHeight: textHeight,
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
	const onFinish = (values) => {
		// const textData = values.textArea;
		// const array = [values.fontSize, values.fontWeight, values.textAlign, values.textHeight];
		// const combinedArray = array.join(' ');
		// setText(textData);
		// setTextStyle(combinedArray);
		// message.success('Component Added Successfully');
		// setPreview((prev) => (prev = [...prev, { ...values, type: 'text' }]));
		// console.log(combinedArray);
		// console.log('Text DATA:', textData);
		// const style = values.fontSize;
		// const combinedStyle = style.join(' ');
		// console.log(combinedStyle);
		form.resetFields();
		const index = preview.findIndex((p) => p.id === values.id);

		// console.log(index);
		if (index >= 0) {
			setPreview((prev) => {
				prev[index] = { ...values };
				return [...prev];
			});
		} else {
			setPreview((prev) => [...prev, { ...values, id: preview.length }]);
		}
	};

	const onTextChange = (e) => {
		const fieldValue = e.target.value;
		setText(fieldValue);
	};
	const onSizeChange = (e) => {
		const fieldValue = e.target.value;
		setSize(fieldValue);
	};
	const onWeightChange = (e) => {
		const fieldValue = e.target.value;
		setWeight(fieldValue);
	};
	const onHeightChange = (e) => {
		const fieldValue = e.target.value;
		setHeight(fieldValue);
	};
	const onAlignChange = (e) => {
		const fieldValue = e.target.value;
		setAlign(fieldValue);
	};
	return (
		<>
			<Form
				className="w-[700px]"
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				layout="vertical"
				form={form}
			>
				<Form.Item hidden name="id">
					<Input hidden />
				</Form.Item>

				<Form.Item name="type" hidden initialValue="text">
					<Input hidden />
				</Form.Item>

				<Form.Item
					label={<p className=" text-[20px] m-0 font-semibold">Font Size</p>}
					className="pt-2 text-[18px]"
					name="fontSize"
					hasFeedback
					rules={[
						{
							required: true,
							message: 'Please choose font size!',
						},
					]}
				>
					<Radio.Group
						style={{
							width: '100%',
						}}
						ref={fontSize}
						onChange={onSizeChange}
					>
						<Row>
							{fontSizeOpt.map((obj, i) => {
								return (
									<Col key={i} span={8}>
										<Radio value={obj.value}>
											<p className=" xs:text-[16px] text-[15px] my-2">{obj.label}</p>
										</Radio>
									</Col>
								);
							})}
						</Row>
					</Radio.Group>
				</Form.Item>
				<Form.Item
					label={<p className=" text-[20px] m-0 font-semibold">Font Weight</p>}
					className="pt-2 text-[18px]"
					name="fontWeight"
					hasFeedback
					rules={[
						{
							required: true,
							message: 'Please choose font weight!',
						},
					]}
				>
					<Radio.Group
						style={{
							width: '100%',
						}}
						ref={fontWeight}
						onChange={onWeightChange}
					>
						<Row>
							{fontWeightOpt.map((obj, i) => {
								return (
									<Col key={i} span={8}>
										<Radio value={obj.value}>
											<p className=" xs:text-[16px] text-[15px] my-2">{obj.label}</p>
										</Radio>
									</Col>
								);
							})}
						</Row>
					</Radio.Group>
				</Form.Item>
				<Form.Item
					label={<p className=" text-[20px] m-0 font-semibold">Text Align</p>}
					className="pt-2 text-[18px]"
					name="textAlign"
					hasFeedback
					rules={[
						{
							required: true,
							message: 'Please choose text align style!',
						},
					]}
				>
					<Radio.Group
						style={{
							width: '100%',
						}}
						ref={textAlign}
						onChange={onAlignChange}
					>
						<Row>
							{textAlignOpt.map((obj, i) => {
								return (
									<Col key={i} span={8}>
										<Radio value={obj.value}>
											<p className=" xs:text-[16px] text-[15px] my-2">{obj.label}</p>
										</Radio>
									</Col>
								);
							})}
						</Row>
					</Radio.Group>
				</Form.Item>
				<Form.Item
					label={<p className=" text-[20px] m-0 font-semibold">Text Height</p>}
					className="pt-2 text-[18px]"
					name="textHeight"
					hasFeedback
					rules={[
						{
							required: true,
							message: 'Please choose text height style!',
						},
					]}
				>
					<Radio.Group
						style={{
							width: '100%',
						}}
						ref={textHeight}
						onChange={onHeightChange}
					>
						<Row>
							{textHeightOpt.map((obj, i) => {
								return (
									<Col key={i} span={8}>
										<Radio value={obj.value}>
											<p className=" xs:text-[16px] text-[15px] my-2">{obj.label}</p>
										</Radio>
									</Col>
								);
							})}
						</Row>
					</Radio.Group>
				</Form.Item>
				<Form.Item
					label={<p className=" text-[20px] m-0 font-semibold">Text Area</p>}
					className="pt-2 text-[18px]"
					name="textArea"
					hasFeedback
					rules={[
						{
							required: true,
							message: 'Please input text!',
						},
					]}
				>
					<TextArea onChange={onTextChange} rows={8} />
				</Form.Item>
				<Form.Item>
					<Button
						className=" w-full h-12 rounded-lg mt-5 sm:text-lg text-base"
						type="primary"
						htmlType="submit"
						onClick={() => message.success('Text added successfully!')}
					>
						Add
					</Button>
				</Form.Item>
			</Form>
		</>
	);
};

export default AddTextForm;
