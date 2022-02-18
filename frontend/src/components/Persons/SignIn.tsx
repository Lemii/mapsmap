import { cryptography } from '@liskhq/lisk-client';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { ReactElement, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { UserContext } from '../../contexts/userContext';
import { getAccount } from '../../services/api';
import { getCredentials } from '../../utils/crypto';
import { infoHandler, warningHandler } from '../../utils/handlers';
import PageTitle from '../Generic/PageTitle';

type FormData = {
	passphrase: string;
};

const SignIn = (): ReactElement => {
	const { updateUserCredentials } = useContext(UserContext);
	const navigate = useNavigate();

	const onFinish = async ({ passphrase }: FormData) => {
		const credentials = getCredentials(passphrase);

		try {
			await getAccount(cryptography.getAddressFromPassphrase(passphrase));

			updateUserCredentials(credentials);
			navigate('/persons/view/me');
			infoHandler(undefined, 'Successfully logged in.');
		} catch (err) {
			warningHandler(undefined, 'Invalid passphrase.');
		}
	};

	return (
		<div>
			<PageTitle>Sign In</PageTitle>

			<Row justify="center" align="middle">
				<Col xs={24} sm={24} md={24} lg={18} xl={12}>
					<Card bordered={false}>
						<Form
							name="basic"
							layout="vertical"
							initialValues={{ remember: true }}
							onFinish={onFinish}
							autoComplete="off"
							className="text-center"
						>
							<Form.Item
								label="Passphrase"
								name="passphrase"
								rules={[{ required: true, message: 'Please enter your secret passphrase!' }]}
							>
								<Input maxLength={120} type="password" />
							</Form.Item>
							<Form.Item>
								<Button type="primary" htmlType="submit">
									Sign In
								</Button>

								<Button onClick={() => navigate('/persons/add')} style={{ marginLeft: '1em' }}>
									Create Account
								</Button>
							</Form.Item>
						</Form>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default SignIn;
