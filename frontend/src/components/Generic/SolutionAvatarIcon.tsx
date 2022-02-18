import { SmileOutlined } from '@ant-design/icons';
import Avatar from 'antd/lib/avatar/avatar';
import { ReactElement } from 'react';

const SolutionAvatarIcon = (): ReactElement => {
	return <Avatar icon={<SmileOutlined />} style={{ backgroundColor: '#b977b9' }} />;
};

export default SolutionAvatarIcon;
