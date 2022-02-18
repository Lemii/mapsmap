import Popconfirm from 'antd/es/popconfirm';
import { ReactElement } from 'react';

import config from '../../config';
import { FEES } from '../../constants';

type Props = {
	formType: keyof typeof FEES;
	children: any;
};

const FormPopConfirm = ({ formType, children }: Props): ReactElement => {
	const fee = FEES[formType];

	return (
		<Popconfirm
			okButtonProps={{ htmlType: 'submit', form: 'form' }}
			title={`This action costs ${fee} ${config.ticker}, proceed?`}
		>
			{children}
		</Popconfirm>
	);
};

export default FormPopConfirm;
