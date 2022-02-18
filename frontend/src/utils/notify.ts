import { notification } from 'antd';

type NotificationTypes = 'success' | 'info' | 'warning' | 'error';

const notify = (type: NotificationTypes, message: string, description?: string) => {
	notification[type]({ message, description });
};

export default notify;
