import { Button, Card, Col, Form, Input, Result, Row } from 'antd';
import { ReactElement, useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import config from '../../config';
import { UserContext } from '../../contexts/userContext';
import { sendAddSolutionAsset } from '../../services/transactions';
import { AddSolutionProps } from '../../services/types';
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

const AddSolutionForm = ({
	onFinish,
	problemId,
	disabled,
}: {
	onFinish: (formData: FormData) => void;
	problemId: string;
	disabled: boolean;
}): ReactElement => (
	<Form name="basic" onFinish={onFinish} autoComplete="off" initialValues={{ problemId }} layout="vertical" id="form">
		<Form.Item label="Problem Id" name="problemId" rules={[{ required: true }]}>
			<Input value={problemId} readOnly disabled />
		</Form.Item>
		<Form.Item
			label="Description"
			name="description"
			rules={[{ required: true, message: 'Please enter a description!' }]}
		>
			<MDEditor charLimit={config.solutionDescriptionLimit} />
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
			<FormPopConfirm formType="addSolution">
				<Button type="primary" disabled={disabled} size="large">
					Submit
				</Button>
			</FormPopConfirm>
		</Form.Item>
	</Form>
);

const AddSolution = () => {
	const [formCompleted, setFormCompleted] = useState(false);
	const [solutionId, setSolutionId] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();
	const { userCredentials } = useContext(UserContext);
	const { id } = useParams<{ id: string }>();

	const onFinish = async (formData: FormData) => {
		if (!id || disabled) {
			return;
		}

		try {
			const asset: AddSolutionProps = {
				problemId: id,
				description: formData.description,
				tags: [formData.tag1, formData.tag2, formData.tag3, formData.tag4],
			};

			const { transactionId } = await sendAddSolutionAsset(userCredentials.passphrase, asset);

			setSolutionId(transactionId);
			setFormCompleted(true);
		} catch (err) {
			errorHandler(err, setError);
		}
	};

	const viewSolution = () => {
		navigate(`/solutions/view/${solutionId}`);
	};

	if (!id) {
		return <NotFound message="No solution id specified" />;
	}

	const disabled = !userCredentials;

	return (
		<div>
			<PageTitle>Add Solution</PageTitle>

			<Card bordered={false}>
				{!error && !solutionId && !formCompleted && (
					<AddSolutionForm onFinish={onFinish} problemId={id} disabled={disabled} />
				)}

				{!error && formCompleted && (
					<Result
						status="success"
						title="Successfully Added Solution!"
						subTitle={`Solution id: ${solutionId}. Processing takes about 10 seconds.`}
						extra={[
							<Button key="view" onClick={viewSolution} type="primary">
								View Solution
							</Button>,
						]}
					/>
				)}
			</Card>
		</div>
	);
};

export default AddSolution;
