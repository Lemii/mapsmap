import { Button, Card, Col, Form, Input, InputNumber, Result, Row, Select } from 'antd';
import { ReactElement, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import config from '../../config';
import { UserContext } from '../../contexts/userContext';
import { getProblemById } from '../../services/api';
import { sendEditProblemAsset } from '../../services/transactions';
import { EditProblemProps } from '../../services/types';
import { Problem } from '../../types';
import { errorHandler } from '../../utils/handlers';
import FormPopConfirm from '../Generic/FormPopConfirm';
import MDEditor from '../Generic/MDEditor';
import NotFound from '../Generic/NotFound';
import PageTitle from '../Generic/PageTitle';
import { categories } from './categories';

const { Option } = Select;

type FormData = {
	id: string;
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

const EditProblemForm = ({
	onFinish,
	initialValues,
	disabled,
}: {
	onFinish: (formData: FormData) => void;
	initialValues: FormData;
	disabled: boolean;
}): ReactElement => (
	<Form name="basic" onFinish={onFinish} autoComplete="off" initialValues={initialValues} layout="vertical" id="form">
		<Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please enter a title!' }]}>
			<Input maxLength={20} disabled />
		</Form.Item>
		<Form.Item
			label="Description"
			name="description"
			rules={[{ required: true, message: 'Please enter a description!' }]}
		>
			<MDEditor initialValue={initialValues.description} charLimit={config.problemDescriptionLimit} />
		</Form.Item>
		<Form.Item
			label="Solution conditions"
			name="solutionConditions"
			rules={[{ required: true, message: 'Please enter the conditions for the solution!' }]}
		>
			<MDEditor initialValue={initialValues.solutionConditions} charLimit={config.problemDescriptionLimit} />
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
			<InputNumber style={{ width: 100 }} min={0} max={100000} disabled />
		</Form.Item>
		<Form.Item className="text-center">
			<FormPopConfirm formType="editProblem">
				<Button type="primary" disabled={disabled} size="large">
					Update
				</Button>
			</FormPopConfirm>
		</Form.Item>
	</Form>
);

const EditProblem = () => {
	const [formCompleted, setFormCompleted] = useState(false);
	const [problem, setProblem] = useState<null | Problem>(null);
	const { userCredentials } = useContext(UserContext);
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();

	useEffect(() => {
		const fetchData = async () => {
			if (!id) {
				return;
			}

			const data = await getProblemById(id);
			setProblem(data || null);
		};

		fetchData();
	}, [id]);

	const onFinish = async (formData: FormData) => {
		if (!id || disabled) {
			return;
		}

		try {
			const asset: EditProblemProps = {
				id,
				title: formData.title,
				description: formData.description,
				solutionConditions: formData.solutionConditions,
				tags: [formData.tag1, formData.tag2, formData.tag3, formData.tag4],
				category: formData.category,
				chestFund: formData.chestFund,
			};

			await sendEditProblemAsset(userCredentials.passphrase, asset);

			setFormCompleted(true);
		} catch (err) {
			errorHandler(err);
		}
	};

	const convertToFormData = (problem: Problem) => {
		const { data } = problem;

		return {
			id: data.id,
			title: data.title,
			description: data.description,
			solutionConditions: data.solutionConditions,
			tag1: data.tags[0],
			tag2: data.tags[1],
			tag3: data.tags[2],
			tag4: data.tags[3],
			category: data.category,
			chestFund: data.chestFund,
		};
	};

	const viewProblem = () => {
		navigate(`/problems/${id}`);
	};

	if (!problem || !id) {
		return <NotFound message="Problem does not exist." />;
	}

	const isOwner = problem.data.owner.id === userCredentials?.binaryAddress;
	const disabled = !userCredentials || !isOwner;

	return (
		<div>
			<PageTitle>Update Problem</PageTitle>

			<Card bordered={false}>
				{!formCompleted ? (
					<EditProblemForm onFinish={onFinish} initialValues={convertToFormData(problem)} disabled={disabled} />
				) : (
					<Result
						status="success"
						title="Successfully Updated Problem!"
						subTitle={`Problem id: ${id}. Processing takes about 10 seconds.`}
						extra={[
							<Button key="view" onClick={viewProblem} type="primary">
								View Problem
							</Button>,
						]}
					/>
				)}
			</Card>
		</div>
	);
};

export default EditProblem;
