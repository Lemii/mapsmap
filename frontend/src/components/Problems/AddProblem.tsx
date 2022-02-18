import { Button, Card, Col, Form, Input, InputNumber, Result, Row, Select } from 'antd';
import { ReactElement, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import config from '../../config';
import { UserContext } from '../../contexts/userContext';
import { sendAddProblemAsset } from '../../services/transactions';
import { AddProblemProps } from '../../services/types';
import { errorHandler } from '../../utils/handlers';
import FormPopConfirm from '../Generic/FormPopConfirm';
import MDEditor from '../Generic/MDEditor';
import PageTitle from '../Generic/PageTitle';
import { categories } from './categories';

const { Option } = Select;

type FormData = {
	title: string;
	description: string;
	solutionConditions: string;
	tag1: string;
	tag2: string;
	tag3: string;
	tag4: string;
	category: number;
	chestFund: number;
};

const AddProblemForm = ({
	onFinish,
	disabled,
}: {
	onFinish: (formData: FormData) => void;
	disabled: boolean;
}): ReactElement => (
	<Form
		name="basic"
		onFinish={onFinish}
		autoComplete="off"
		initialValues={{ chestFund: 0 }}
		layout="vertical"
		id="form"
	>
		<Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please enter a title!' }]}>
			<Input maxLength={40} minLength={3} />
		</Form.Item>
		<Form.Item
			label="Description"
			name="description"
			rules={[{ required: true, message: 'Please enter a description!' }]}
		>
			<MDEditor charLimit={config.problemDescriptionLimit} />
		</Form.Item>
		<Form.Item
			label="Solution conditions"
			name="solutionConditions"
			rules={[{ required: true, message: 'Please enter the conditions for the solution!' }]}
		>
			<MDEditor charLimit={config.problemDescriptionLimit} />
		</Form.Item>

		<div className="text-center" style={{ marginBottom: '2em' }}>
			Please enter 4 tags related to your problem.
		</div>

		<Row gutter={16}>
			<Col span={12}>
				<Form.Item label="Tag 1" name="tag1" rules={[{ required: true, message: 'Please add 4 tags!' }]}>
					<Input maxLength={20} minLength={3} />
				</Form.Item>
			</Col>
			<Col span={12}>
				<Form.Item label="Tag 2" name="tag2" rules={[{ required: true, message: 'Please add 4 tags!' }]}>
					<Input maxLength={20} minLength={3} />
				</Form.Item>
			</Col>
		</Row>
		<Row gutter={16}>
			<Col span={12}>
				<Form.Item label="Tag 3" name="tag3" rules={[{ required: true, message: 'Please add 4 tags!' }]}>
					<Input maxLength={20} minLength={3} />
				</Form.Item>
			</Col>
			<Col span={12}>
				<Form.Item label="Tag 4" name="tag4" rules={[{ required: true, message: 'Please add 4 tags!' }]}>
					<Input maxLength={20} minLength={3} />
				</Form.Item>
			</Col>
		</Row>
		<Form.Item
			name="category"
			label="Category"
			hasFeedback
			rules={[{ required: true, message: 'Please select a category!' }]}
		>
			<Select placeholder="Please select a category">
				{categories.map((data, index) => (
					<Option key={index} value={index}>
						{data}
					</Option>
				))}
			</Select>
		</Form.Item>
		<Form.Item
			label="Amount locked tokens"
			name="chestFund"
			tooltip="Please indicate how much tokens a person receives upon solving the problem."
			rules={[{ required: false }]}
		>
			<InputNumber style={{ width: 100 }} min={0} max={100000} />
		</Form.Item>
		<Form.Item className="text-center">
			<FormPopConfirm formType="addProblem">
				<Button type="primary" disabled={disabled} size="large">
					Submit
				</Button>
			</FormPopConfirm>
		</Form.Item>
	</Form>
);

const AddProblem = () => {
	const [formCompleted, setFormCompleted] = useState(false);
	const [problemId, setProblemId] = useState('');
	const { userCredentials } = useContext(UserContext);
	const navigate = useNavigate();

	const onFinish = async (formData: FormData) => {
		if (disabled) {
			return;
		}

		try {
			const asset: AddProblemProps = {
				title: formData.title,
				description: formData.description,
				solutionConditions: formData.solutionConditions,
				tags: [formData.tag1, formData.tag2, formData.tag3, formData.tag4],
				category: formData.category,
				chestFund: formData.chestFund,
			};

			const { transactionId } = await sendAddProblemAsset(userCredentials.passphrase, asset);

			setProblemId(transactionId);
			setFormCompleted(true);
		} catch (err) {
			errorHandler(err);
		}
	};

	const reset = () => {
		setProblemId('');
		setFormCompleted(false);
	};

	const viewProblem = () => {
		navigate(`/problems/${problemId}`);
	};

	const disabled = !userCredentials;

	return (
		<div>
			<PageTitle>Add Problem</PageTitle>

			<Card bordered={false}>
				{!problemId && !formCompleted && <AddProblemForm onFinish={onFinish} disabled={disabled} />}

				{formCompleted && (
					<Result
						status="success"
						title="Successfully Added Problem!"
						subTitle={`Problem id: ${problemId}. Processing takes about 10 seconds.`}
						extra={[
							<Button key="view" onClick={viewProblem} type="primary">
								View Problem
							</Button>,
							<Button key="add" onClick={reset}>
								Add Another
							</Button>,
						]}
					/>
				)}
			</Card>
		</div>
	);
};

export default AddProblem;
