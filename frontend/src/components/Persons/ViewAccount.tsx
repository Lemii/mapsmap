import { Card, Col, Row } from 'antd';
import { ReactElement, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getAccount } from '../../services/api';
import { AccountProps } from '../../types';
import AccountDetails from './AccountDetails';

const ViewAccount = (): ReactElement => {
	const [account, setAccount] = useState<AccountProps | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const { id } = useParams<{ id: string }>();

	useEffect(() => {
		const fetchData = async () => {
			if (!id) {
				return;
			}

			const data = await getAccount(id);

			setAccount(data || null);
			setIsLoading(false);
		};

		fetchData();
	}, [id]);

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

export default ViewAccount;
