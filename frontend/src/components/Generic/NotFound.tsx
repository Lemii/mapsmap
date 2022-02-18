import { Result } from 'antd';
import { ReactElement } from 'react';

type Props = {
	message?: string;
};

const NotFound = ({ message = 'Sorry, the page you visited does not exist.' }: Props): ReactElement => {
	return (
		<div>
			<Result status="404" title="404" subTitle={message} />
		</div>
	);
};

export default NotFound;
