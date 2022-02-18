import { Button, Card, Col, Form, Input, Result, Row, Select, Typography } from 'antd';
import countries from 'i18n-iso-countries';
import { ReactElement, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { fundAccount, sendRegisterUserAsset } from '../../services/transactions';
import { RegisterUserProps } from '../../services/types';
import { Timeout } from '../../types';
import { jsonToBuffer } from '../../utils/contacts';
import { getCredentials } from '../../utils/crypto';
import { errorHandler, successHandler } from '../../utils/handlers';
import PageTitle from '../Generic/PageTitle';

countries.registerLocale(require('i18n-iso-countries/langs/en.json'));

const { Option } = Select;
const countriesList = countries.getNames('en');

type FormData = {
	username: string;
	country: string;
	twitter: string;
	discord: string;
	telegram: string;
};

const CreateAccountForm = ({
	onFinish,
	loading,
}: {
	onFinish: (formData: FormData) => void;
	loading: boolean;
}): ReactElement => (
	<Form name="basic" onFinish={onFinish} autoComplete="off" layout="vertical">
		<Form.Item label="Username" name="username" rules={[{ required: true, message: 'Please add a username!' }]}>
			<Input minLength={3} maxLength={20} />
		</Form.Item>
		<div className="text-center">Please add at least one way to contact you.</div>
		<Form.Item label="Twitter" name="twitter" rules={[{ required: false }]}>
			<Input minLength={3} maxLength={20} />
		</Form.Item>
		<Form.Item label="Telegram" name="telegram" rules={[{ required: false }]}>
			<Input minLength={3} maxLength={20} />
		</Form.Item>
		<Form.Item label="Discord" name="discord" rules={[{ required: false }]}>
			<Input minLength={3} maxLength={20} />
		</Form.Item>
		<Form.Item
			name="country"
			label="Country"
			hasFeedback
			rules={[{ required: true, message: 'Please select a country!' }]}
		>
			<Select placeholder="Please select a country">
				{Object.values(countriesList).map((data, index) => (
					<Option key={index} value={data}>
						{data}
					</Option>
				))}
			</Select>
		</Form.Item>
		<Form.Item className="text-center">
			<Button type="primary" htmlType="submit" loading={loading}>
				Submit
			</Button>
		</Form.Item>
	</Form>
);

const CreateAccount = () => {
	const [formCompleted, setFormCompleted] = useState(false);
	const [loading, setLoading] = useState(false);
	const [credentials] = useState(getCredentials());
	const [timeoutId, setTimeoutId] = useState<Timeout>();
	const navigate = useNavigate();

	useEffect(() => {
		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	}, [timeoutId]);

	const onFinish = async (formData: FormData) => {
		setLoading(true);

		try {
			const asset: RegisterUserProps = {
				username: formData.username,
				contacts: jsonToBuffer({ discord: formData.discord, twitter: formData.twitter, telegram: formData.telegram }),
				country: countries.getAlpha3Code(formData.country, 'en'),
			};

			await fundAccount(credentials.mapAddress);

			let timer: Timeout = setTimeout(async () => {
				setTimeoutId(timer);

				try {
					await sendRegisterUserAsset(credentials.passphrase, asset);
					setFormCompleted(true);
					setLoading(false);
					successHandler(undefined, 'Account successfully created.');
				} catch (err) {
					errorHandler(err);
					setLoading(false);
				}
			}, 10000);
		} catch (err) {
			errorHandler(err);
			setLoading(false);
		}
	};

	return (
		<div>
			<PageTitle>Create Account</PageTitle>

			<Row justify="center" align="middle">
				<Col xs={24} sm={24} md={24} lg={18} xl={12}>
					<Card bordered={false}>
						{!formCompleted ? (
							<CreateAccountForm onFinish={onFinish} loading={loading} />
						) : (
							<Result
								status="success"
								title="Account Created"
								subTitle={
									<div style={{ marginTop: '1em' }}>
										<div>You can now log in with the following passphrase:</div>
										<Typography.Title level={3} style={{ marginTop: '2em', marginBottom: '2em' }} copyable>
											{credentials.passphrase}
										</Typography.Title>

										<div>
											This is the password for your account.{' '}
											<strong>
												<u>Store it safely!</u>
											</strong>
											<br />
											If you lose it, you can not access your account any more.
										</div>
									</div>
								}
								extra={[
									<Button key="sign-in" onClick={() => navigate('/persons/sign-in')} type="primary">
										Go To Sign In
									</Button>,
								]}
							/>
						)}
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default CreateAccount;
