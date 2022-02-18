import { ReactElement, useEffect, useState } from 'react';

import { getSolutionWordCloud } from '../../services/api';
import { TagCloudData } from '../../types';
import Loader from '../Generic/Loader';
import WordCloud from '../Generic/WordCloud';

type Props = {
	closeHandler: () => void;
};

const SolutionWordCloud = ({ closeHandler }: Props): ReactElement => {
	const [tagCloudData, setTagCloudData] = useState<TagCloudData>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			const data = await getSolutionWordCloud();
			setTagCloudData(data);
			setIsLoading(false);
		};

		fetchData();
	}, []);

	return isLoading ? <Loader /> : <WordCloud tagCloudData={tagCloudData} closeHandler={closeHandler} />;
};

export default SolutionWordCloud;
