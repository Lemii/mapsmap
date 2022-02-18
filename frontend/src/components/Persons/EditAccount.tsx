import { Button, Card, Col, Form, Input, Row, Select } from 'antd';
import countries from 'i18n-iso-countries';
import { ReactElement, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { UserContext } from '../../contexts/userContext';
import { getAccount } from '../../services/api';
import { sendEditUserAsset } from '../../services/transactions';
import { EditUserProps } from '../../services/types';
import { AccountProps } from '../../types';
import { bufferToJson, jsonToBuffer } from '../../utils/contacts';
import { errorHandler, successHandler } from '../../utils/handlers';
import FormPopConfirm from '../Generic/FormPopConfirm';
import Loader from '../Generic/Loader';
import NotFound from '../Generic/NotFound';
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

const EditAccountForm = ({
	onFinish,
	initialValues,
}: {
	onFinish: (formData: FormData) => void;
	initialValues: FormData;
}): ReactElement => (
	<Form name="basic" onFinish={onFinish} autoComplete="off" initialValues={initialValues} layout="vertical" id="form">
		<Form.Item label="Username" name="username" rules={[{ required: true, message: 'Please add a username!' }]}>
			<Input disabled />
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
			<Select placeholder="Please select a country" disabled>
				{Object.values(countriesList).map((data, index) => (
					<Option key={index} value={data}>
						{data}
					</Option>
				))}
			</Select>
		</Form.Item>
		<Form.Item className="text-center">
			<FormPopConfirm formType="editUser">
				<Button type="primary">Submit</Button>
			</FormPopConfirm>
		</Form.Item>
	</Form>
);

const EditAccount = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [account, setAccount] = useState<null | AccountProps>(null);
	const { userCredentials } = useContext(UserContext);
	const navigate = useNavigate();

	useEffect(() => {
		if (!userCredentials) {
			navigate('/create-account');
			return;
		}

		const fetchData = async () => {
			const data = await getAccount(userCredentials.binaryAddress);
			setAccount(data);
			setIsLoading(false);
		};

		fetchData();
	}, [navigate, userCredentials]);

	const onFinish = async (formData: FormData) => {
		try {
			const asset: EditUserProps = {
				contacts: jsonToBuffer({
					discord: formData.discord,
					twitter: formData.twitter,
					telegram: formData.telegram,
				}),
				username: formData.username,
				country: formData.country,
			};

			await sendEditUserAsset(userCredentials!.passphrase, asset);
			successHandler(undefined, 'Account successfully updated.');
			navigate('/persons/view/me');
		} catch (err) {
			errorHandler(err);
		}
	};

	const convertToFormData = (account: AccountProps) => {
		const { username, country, contacts } = account.mapsmap;

		const { twitter, telegram, discord } = bufferToJson(contacts);

		return {
			username: username || 'genesis',
			country,
			twitter,
			telegram,
			discord,
		};
	};

	if (!isLoading && !account) {
		return <NotFound message="Account does not exist." />;
	}

	return (
		<div>
			<PageTitle>Edit Account</PageTitle>
			<Row justify="center" align="middle">
				<Col xs={24} sm={24} md={24} lg={18} xl={12}>
					<Card style={{ minHeight: '400px' }} bordered={false}>
						{isLoading ? (
							<Loader />
						) : (
							<EditAccountForm onFinish={onFinish} initialValues={convertToFormData(account!)} />
						)}
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default EditAccount;
