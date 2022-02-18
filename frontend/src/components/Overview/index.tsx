import './index.css';

import { Alert, Button, Card } from 'antd';
import { ReactElement, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';

import { getState } from '../../services/api';
import { ChainState } from '../../types';
import PageTitle from '../Generic/PageTitle';
import GlobalOverview from './GlobalOverview';

export default function Overview(): ReactElement {
	const [stateData, setStateData] = useState<ChainState | undefined>();
	const [isLoading, setIsLoading] = useState(true);
	const [mobileOverride, setMobileOverride] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			const data = await getState();
			setStateData(data);
			setIsLoading(false);
		};

		fetchData();
	}, []);

	return (
		<div>
			<PageTitle>Overview</PageTitle>

			{isMobile && !mobileOverride && (
				<>
					<Alert
						message="Warning"
						description="It is recommended to view this page on a desktop device."
						type="warning"
						showIcon
					/>
					<div className="text-center" style={{ marginTop: '1em' }}>
						<Button onClick={() => setMobileOverride(true)}>Show me anyway</Button>
					</div>
				</>
			)}

			{(!isMobile || mobileOverride) && (
				<Card className="CardOverview" bordered={false}>
					<GlobalOverview stateData={stateData} isLoading={isLoading} />
				</Card>
			)}
		</div>
	);
}
