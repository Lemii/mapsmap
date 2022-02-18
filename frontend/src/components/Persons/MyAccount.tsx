import { Card, Col, Row } from 'antd';
import { ReactElement, useContext, useEffect, useState } from 'react';

import { UserContext } from '../../contexts/userContext';
import { getAccount } from '../../services/api';
import { AccountProps } from '../../types';
import AccountDetails from './AccountDetails';

const MyAccount = (): ReactElement => {
	const [account, setAccount] = useState<AccountProps | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const { userCredentials } = useContext(UserContext);

	useEffect(() => {
		const fetchData = async () => {
			if (!userCredentials) {
				return;
			}

			const data = await getAccount(userCredentials.binaryAddress);

			setAccount(data || null);
			setIsLoading(false);
		};

		fetchData();
	}, [userCredentials]);

	return (
		<Row justify="center" align="middle">
			<Col xs={24} sm={24} md={24} lg={12} xl={12} style={{ maxWidth: '700px' }}>
				<Card style={{ minHeight: '400px' }} bordered={false}>
					<AccountDetails account={account} isLoading={isLoading} />
				</Card>
			</Col>
		</Row>
	);
};

export default MyAccount;
