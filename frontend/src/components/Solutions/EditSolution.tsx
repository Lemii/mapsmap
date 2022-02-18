import { Button, Card, Col, Form, Input, Result, Row } from 'antd';
import { ReactElement, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import config from '../../config';
import { UserContext } from '../../contexts/userContext';
import { getSolutionById } from '../../services/api';
import { sendEditSolutionAsset } from '../../services/transactions';
import { EditSolutionProps } from '../../services/types';
import { Solution } from '../../types';
import { errorHandler } from '../../utils/handlers';
import FormPopConfirm from '../Generic/FormPopConfirm';
import MDEditor from '../Generic/MDEditor';
import NotFound from '../Generic/NotFound';
import PageTitle from '../Generic/PageTitle';

type FormData = {
	problemId: string;
	description: string;
	tag1: string;
	tag2: string;
	tag3: string;
	tag4: string;
};

const EditSolutionForm = ({
	onFinish,
	initialValues,
	disabled,
}: {
	onFinish: (formData: FormData) => void;
	initialValues: FormData;
	disabled: boolean;
}): ReactElement => (
	<Form name="basic" onFinish={onFinish} autoComplete="off" initialValues={initialValues} layout="vertical" id="form">
		<Form.Item label="Problem Id" name="problemId" rules={[{ required: true }]}>
			<Input readOnly disabled />
		</Form.Item>
		<Form.Item
			label="Description"
			name="description"
			rules={[{ required: true, message: 'Please enter a description!' }]}
		>
			<MDEditor initialValue={initialValues.description} charLimit={config.solutionDescriptionLimit} />
		</Form.Item>

		<div className="text-center" style={{ marginBottom: '2em' }}>
			Please enter 4 tags related to your solution.
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
		<Form.Item className="text-center">
			<FormPopConfirm formType="editSolution">
				<Button type="primary" htmlType="submit" disabled={disabled} size="large">
					Update
				</Button>
			</FormPopConfirm>
		</Form.Item>
	</Form>
);

const EditSolution = () => {
	const [formCompleted, setFormCompleted] = useState(false);
	const [error, setError] = useState('');
	const [solution, setSolution] = useState<null | Solution>(null);
	const { userCredentials } = useContext(UserContext);
	const navigate = useNavigate();

	const { id } = useParams<{ id: string }>();

	useEffect(() => {
		const fetchData = async () => {
			if (!id) {
				return;
			}
			const data = await getSolutionById(id);
			if (!data) {
				return;
			}

			setSolution(data);
		};

		fetchData();
	}, [id]);

	const onFinish = async (formData: FormData) => {
		if (!id || disabled) {
			return;
		}

		try {
			const asset: EditSolutionProps = {
				id,
				description: formData.description,
				tags: [formData.tag1, formData.tag2, formData.tag3, formData.tag4],
			};

			await sendEditSolutionAsset(userCredentials.passphrase, asset);

			setFormCompleted(true);
		} catch (err) {
			errorHandler(err, setError);
		}
	};

	const reset = () => {
		setFormCompleted(false);
		setError('');
	};

	const convertToFormData = (solution: Solution) => {
		const { data } = solution;

		return {
			id: data.id,
			description: data.description,
			tag1: data.tags[0],
			tag2: data.tags[1],
			tag3: data.tags[2],
			tag4: data.tags[3],
			problemId: data.problem.id,
		};
	};

	const viewSolution = () => {
		navigate(`/solutions/view/${id}`);
	};

	if (!solution || !id) {
		return <NotFound message="Solution does not exist." />;
	}

	const isOwner = solution.data.owner.id === userCredentials?.binaryAddress;
	const disabled = !userCredentials || !isOwner;

	return (
		<div>
			<PageTitle>Update Solution</PageTitle>

			<Card bordered={false}>
				{!error && !formCompleted && id && (
					<EditSolutionForm onFinish={onFinish} initialValues={convertToFormData(solution)} disabled={disabled} />
				)}

				{!error && formCompleted && (
					<Result
						status="success"
						title="Successfully Updated Solution!"
						subTitle={`Solution id: ${id}. Processing takes about 10 seconds.`}
						extra={[
							<Button key="view" onClick={viewSolution} type="primary">
								View Solution
							</Button>,
						]}
					/>
				)}

				{error && (
					<Result
						status="error"
						title="Could Not Add Solution"
						subTitle={error}
						extra={[
							<Button key="add" onClick={reset} type="primary">
								Try Again
							</Button>,
						]}
					/>
				)}
			</Card>
		</div>
	);
};

export default EditSolution;
