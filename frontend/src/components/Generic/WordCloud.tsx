import './WordCloud.css';

import { Card, Col, Row } from 'antd';
import { ReactElement } from 'react';
import { isMobile } from 'react-device-detect';
import { TagCloud } from 'react-tagcloud';

import { TagCloudData } from '../../types';
import CloseButton from './CloseButton';

const options = {
	luminosity: 'dark',
	hue: '#ad92cb',
};

type Props = {
	closeHandler: () => void;
	tagCloudData: TagCloudData;
};

const WordCloud = ({ tagCloudData, closeHandler }: Props): ReactElement => {
	const handleTagClick = (tag: TagCloudData) => {
		console.debug(tag);
	};

	return (
		<Card style={{ marginBottom: '3em' }} className="word-container" bordered={false}>
			{!isMobile && <CloseButton onClick={closeHandler} />}

			<Row justify="center" align="middle" style={{ minHeight: '150px' }}>
				<Col xs={24} sm={24} md={24} lg={18} xl={18}>
					<TagCloud
						minSize={14}
						maxSize={56}
						tags={tagCloudData}
						colorOptions={options}
						onClick={(tag: TagCloudData) => handleTagClick(tag)}
					/>
				</Col>
			</Row>
		</Card>
	);
};

export default WordCloud;
