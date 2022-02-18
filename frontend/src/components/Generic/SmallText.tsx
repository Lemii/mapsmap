import Text from 'antd/lib/typography/Text';
import { ReactElement } from 'react';

type Props = {
	children: any;
	className?: string;
};

const SmallText = ({ children, className }: Props): ReactElement => {
	return (
		<Text className={className} style={{ fontSize: '0.8em', opacity: '0.5' }}>
			{children}
		</Text>
	);
};

export default SmallText;
