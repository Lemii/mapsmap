import { Card, List, Typography } from 'antd';
import Text from 'antd/lib/typography/Text';
import { ReactElement, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { getSolutionsForProblem } from '../../services/api';
import { Problem, Solution } from '../../types';
import { shortenString } from '../../utils/helpers';
import Loader from '../Generic/Loader';
import NotFound from '../Generic/NotFound';
import SolutionAvatarIcon from '../Generic/SolutionAvatarIcon';

type Props = {
	problem: Problem;
};

const SolutionsForProblem = ({ problem }: Props): ReactElement => {
	const [solutions, setSolutions] = useState<Solution[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			if (!problem) {
				return;
			}
			const solutions = await getSolutionsForProblem(problem.data.id);
			setIsLoading(false);
			setSolutions(solutions);
		};

		fetchData();
	}, [problem]);

	if (isLoading) {
		return <Loader container />;
	}

	if (!problem) {
		return <NotFound message="Problem does not exist." />;
	}

	return (
		<Card style={{ marginTop: '3em' }}>
			<Typography.Title className="text-center" level={4}>
				Solutions Created for Problem
			</Typography.Title>

			<List
				dataSource={solutions}
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

export default SolutionsForProblem;
