import './CloseButton.css';

import { CloseCircleTwoTone } from '@ant-design/icons';
import { ReactElement } from 'react';

type Props = {
	onClick: () => void;
};

const CloseButton = ({ onClick }: Props): ReactElement => {
	return <CloseCircleTwoTone className="close-button" twoToneColor="#b977b9" onClick={onClick} />;
};

export default CloseButton;
