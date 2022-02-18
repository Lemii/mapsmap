import './PageTitle.css';

import Title from 'antd/lib/typography/Title';
import { ReactElement } from 'react';

type Props = {
	children: any;
};

const PageTitle = ({ children }: Props): ReactElement => {
	return (
		<Title level={2} className="page-title">
			<strong>{children}</strong>
		</Title>
	);
};

export default PageTitle;
