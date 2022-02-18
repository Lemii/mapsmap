import { Card, Col, Row, Spin } from 'antd';
import { ReactElement } from 'react';

type Props = {
	minHeight?: string;
	container?: boolean;
};

const Spinner = (): ReactElement => {
	return (
		<div
			style={{
				width: '100%',
				height: '100%',
				verticalAlign: 'middle',
				position: 'absolute',
				top: '42%',
				left: '50%',
			}}
		>
			<Spin size="large" />
		</div>
	);
};

const Loader = ({ minHeight = '300px', container }: Props) => {
	if (!container) {
		return <Spinner />;
	}

	return (
		<Row justify="center" align="middle">
			<Col xs={24} sm={24} md={24} lg={18} xl={12}>
				<Card style={{ minHeight }}>
					<Spinner />
				</Card>
			</Col>
		</Row>
	);
};

export default Loader;
