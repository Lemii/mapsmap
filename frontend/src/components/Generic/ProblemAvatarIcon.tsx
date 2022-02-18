import { NotificationOutlined } from '@ant-design/icons';
import Avatar from 'antd/lib/avatar/avatar';
import { ReactElement } from 'react';

const ProblemAvatarIcon = (): ReactElement => {
	return <Avatar icon={<NotificationOutlined />} style={{ backgroundColor: '#a59fd4' }} />;
};

export default ProblemAvatarIcon;
