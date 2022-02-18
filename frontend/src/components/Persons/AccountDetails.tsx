import { UserOutlined } from '@ant-design/icons';
import { cryptography } from '@liskhq/lisk-client';
import { Button, Divider, List } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import Text from 'antd/lib/typography/Text';
import Title from 'antd/lib/typography/Title';
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import config from '../../config';
import { UserContext } from '../../contexts/userContext';
import { AccountProps } from '../../types';
import { bufferToJson } from '../../utils/contacts';
import { capitalizeFirstLetter, getBalance, getCountryName } from '../../utils/helpers';
import Loader from '../Generic/Loader';
import NotFound from '../Generic/NotFound';
import ProblemAvatarIcon from '../Generic/ProblemAvatarIcon';
import SmallText from '../Generic/SmallText';
import SolutionAvatarIcon from '../Generic/SolutionAvatarIcon';

type Props = {
	account: AccountProps | null;
	isLoading: boolean;
};

const Entry = ({ label, value }: { label: string; value: string }) => {
	return (
		<div style={{ marginBottom: '1em', textAlign: 'center' }}>
			<SmallText>{label}</SmallText>
			<Text style={{ fontWeight: 'bold', display: 'block' }}>{value}</Text>
		</div>
	);
};

const AccountDetails = ({ account, isLoading }: Props) => {
	const { userCredentials } = useContext(UserContext);
	const navigate = useNavigate();

	if (isLoading) {
		return <Loader />;
	}

	if (!account && !isLoading) {
		return <NotFound message="Account not found" />;
	}

	// Dirty workaround
	const acc = account as AccountProps;
	const { mapsmap } = acc;

	const renderContacts = () => {
		const contactsObject = bufferToJson(mapsmap.contacts);

		return (
			<div style={{ display: 'flex', justifyContent: 'center' }}>
				<div style={{ display: 'flex', gap: '3em' }}>
					{Object.entries(contactsObject).map(([type, value]) => (
						<Entry label={capitalizeFirstLetter(type)} value={value} />
					))}
				</div>
			</div>
		);
	};

	const isOwnAccount = cryptography.bufferToHex(acc.address) === userCredentials?.binaryAddress;

	return (
		<div>
			<div className="text-center">
				<Avatar size={64} icon={<UserOutlined />} style={{ backgroundColor: '#92bae4', marginBottom: '0.5em' }} />
			</div>
			<div className="text-center">
				<Title level={2} style={{ margin: 0 }}>
					<strong>{mapsmap.username.toUpperCase()}</strong>
				</Title>
				<SmallText>{getCountryName(mapsmap.country)}</SmallText>
			</div>

			<Divider />

			<div className="text-center">
				<Title level={4}>Account Details</Title>

				<Entry label="Balance" value={`${getBalance(acc.token.balance)} ${config.ticker}`} />
				<Entry label="Address" value={userCredentials!.mapAddress} />

				<Divider />

				<Title level={4}>Contact Details</Title>

				{renderContacts()}
			</div>

			<Divider />

			<Title level={4} className="text-center">
				Problems
			</Title>

			<List
				dataSource={acc.mapsmap.problems}
				renderItem={problem => (
					<List.Item key={problem.id}>
						<List.Item.Meta
							avatar={<ProblemAvatarIcon />}
							title={<Link to={`/problems/view/${problem.id}`}>{problem.title}</Link>}
							description={<Text style={{ fontSize: '0.8em', opacity: '0.5' }}>{problem.id}</Text>}
						/>
					</List.Item>
				)}
			/>

			<Divider />

			<Title level={4} className="text-center">
				Solutions
			</Title>

			<List
				dataSource={acc.mapsmap.solutions}
				renderItem={solution => (
					<List.Item>
						<List.Item.Meta
							avatar={<SolutionAvatarIcon />}
							title={<Link to={`/problems/view/${solution.problem.id}`}>For problem: '{solution.problem.title}'</Link>}
							description={<SmallText>{solution.id}</SmallText>}
						/>
					</List.Item>
				)}
			/>

			{isOwnAccount && (
				<div style={{ marginTop: '1em', textAlign: 'center' }}>
					<Divider />
					<Button onClick={() => navigate('/persons/edit')}>Edit Account</Button>
				</div>
			)}
		</div>
	);
};

export default AccountDetails;
