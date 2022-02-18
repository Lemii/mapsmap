import { Button, Card, Col, Divider, Popconfirm, Row, Typography } from 'antd';
import Text from 'antd/lib/typography/Text';
import { ReactElement, useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { UserContext } from '../../contexts/userContext';
import { getProblemById, getSolutionById } from '../../services/api';
import { sendAcceptSolutionAsset } from '../../services/transactions';
import { Problem, Solution } from '../../types';
import { displayDate } from '../../utils/helpers';
import Check from '../Generic/Check';
import Loader from '../Generic/Loader';
import MDParser from '../Generic/MDParser';
import NotFound from '../Generic/NotFound';
import PageTitle from '../Generic/PageTitle';
import SmallText from '../Generic/SmallText';
import SimilarSolutions from './SimilarSolutions';

const { Title, Paragraph } = Typography;

const ViewSolution = (): ReactElement => {
	const [solution, setSolution] = useState<null | Solution>(null);
	const [solutionProblem, setSolutionProblem] = useState<null | Problem>(null);
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const { userCredentials } = useContext(UserContext);

	useEffect(() => {
		const fetchData = async () => {
			if (!id) {
				return;
			}
			const solution = await getSolutionById(id);

			if (!solution) {
				// Error
				setIsLoading(false);
				return;
			}

			const problem = await getProblemById(solution.data.problem.id);

			setSolution(solution);
			setSolutionProblem(problem || null);
			setIsLoading(false);
		};

		fetchData();
	}, [id]);

	const handleAcceptSolution = async () => {
		if (!solution || !solutionProblem || !userCredentials) {
			return;
		}

		try {
			await sendAcceptSolutionAsset(userCredentials.passphrase, {
				problemId: solution.data.problem.id,
				solutionId: solution.data.id,
			});

			setSolutionProblem(prevState =>
				prevState ? { ...prevState, data: { ...prevState.data, status: 'solved' } } : null,
			);
		} catch {}
	};

	if (isLoading) {
		return <Loader container />;
	}

	if (!solution) {
		return <NotFound message="Solution does not exist." />;
	}

	const { problem, owner, description } = solution.data;
	const isOwnerOfProblem = solutionProblem?.data.owner.id === userCredentials?.binaryAddress;
	const isOwnerOfSolution = solution.data.owner.id === userCredentials?.binaryAddress;
	const isProblemOpen = solutionProblem?.data.status === 'open';

	return (
		<div>
			<PageTitle>Solution</PageTitle>
			<Row justify="center" align="middle">
				<Col xs={24} sm={24} md={24} lg={18} xl={12}>
					<Card bordered={false}>
						<Paragraph className="text-center">
							Solution for <Link to={'/problems/view/' + problem.id}>{problem.title}</Link>, created by{' '}
							<Link to={`/persons/view/${owner.id}`}> {owner.username}</Link>
							<br />
							<SmallText>Created on: {displayDate(solution.meta.createdAt)}</SmallText>
						</Paragraph>

						<Divider />

						<Title className="text-center" level={4}>
							Description
						</Title>

						<Paragraph>
							<MDParser input={description} />
						</Paragraph>

						<div className="text-center">
							<SmallText>Last modified: {displayDate(solution.meta.lastModified)}</SmallText>
						</div>

						<div className="text-center">
							{isOwnerOfSolution && isProblemOpen && (
								<>
									<Divider />

									<Button type="dashed" onClick={() => navigate('/solutions/edit/' + solution.data.id)}>
										Edit Solution
									</Button>
								</>
							)}

							{isOwnerOfProblem && isProblemOpen && (
								<>
									<Divider />

									<Popconfirm
										title="This will permanently mark your problem as 'solved'. Continue?"
										onConfirm={handleAcceptSolution}
									>
										<Button type="dashed">Accept Solution</Button>
									</Popconfirm>
								</>
							)}
							{solutionProblem?.data.solvedBy === solution.data.id && (
								<>
									<Divider />

									<strong>
										<Text style={{ opacity: '50%' }}>Marked as accepted solution</Text>
										<Check />
									</strong>
								</>
							)}
						</div>
					</Card>

					<SimilarSolutions solution={solution} />
				</Col>
			</Row>
		</div>
	);
};

export default ViewSolution;
