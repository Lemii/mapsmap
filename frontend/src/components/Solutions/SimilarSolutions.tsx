import { Card, List, Typography } from 'antd';
import Text from 'antd/lib/typography/Text';
import { ReactElement, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { getSolutionsForProblem } from '../../services/api';
import { Solution } from '../../types';
import { shortenString } from '../../utils/helpers';
import SolutionAvatarIcon from '../Generic/SolutionAvatarIcon';

type Props = {
	solution: Solution | null;
};

const SimilarSolutions = ({ solution }: Props): ReactElement => {
	const [isLoading, setIsLoading] = useState(true);
	const [solutions, setSolutions] = useState<Solution[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			if (!solution) {
				return;
			}

			const solutions = await getSolutionsForProblem(solution.data.problem.id);

			setSolutions(solutions);
			setIsLoading(false);
		};

		fetchData();
	}, [solution]);

	return (
		<Card style={{ marginTop: '3em' }}>
			<Typography.Title className="text-center" level={4}>
				Other Solutions for Problem
			</Typography.Title>

			<List
				loading={isLoading}
				dataSource={solutions.filter(s => s.data.id !== solution?.data.id)}
				renderItem={solution => (
					<List.Item key={solution.data.id}>
						<List.Item.Meta
							avatar={<SolutionAvatarIcon />}
							title={
								<Link to={`/solutions/view/${solution.data.id}`}>{shortenString(solution.data.description, 60)}</Link>
							}
							description={
								<Text style={{ fontSize: '0.8em', opacity: '0.5' }}>
									Created by: <Link to={`/persons/view/${solution.data.owner.id}`}>{solution.data.owner.username}</Link>
								</Text>
							}
						/>
					</List.Item>
				)}
			/>
		</Card>
	);
};

export default SimilarSolutions;
