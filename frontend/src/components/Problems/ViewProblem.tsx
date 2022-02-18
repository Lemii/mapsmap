import { Button, Card, Col, Divider, Row, Typography } from 'antd';
import Text from 'antd/lib/typography/Text';
import { ReactElement, useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import config from '../../config';
import { UserContext } from '../../contexts/userContext';
import { getProblemById } from '../../services/api';
import { Problem } from '../../types';
import { capitalizeFirstLetter, displayDate } from '../../utils/helpers';
import Loader from '../Generic/Loader';
import MDParser from '../Generic/MDParser';
import NotFound from '../Generic/NotFound';
import PageTitle from '../Generic/PageTitle';
import SmallText from '../Generic/SmallText';
import { categories } from './categories';
import SolutionsForProblem from './SolutionsForProblem';

const { Title, Paragraph } = Typography;

const Entry = ({ label, value }: { label: string; value: string }) => {
	return (
		<div style={{ marginBottom: '1em', textAlign: 'center' }}>
			<SmallText>{label}</SmallText>
			<Text style={{ fontWeight: 'bold', display: 'block' }}>{capitalizeFirstLetter(value)}</Text>
		</div>
	);
};

const ViewProblem = (): ReactElement => {
	const [problem, setProblem] = useState<null | Problem>(null);
	const [isLoading, setIsLoading] = useState(true);

	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { userCredentials } = useContext(UserContext);

	useEffect(() => {
		const fetchData = async () => {
			if (!id) {
				return;
			}

			const problem = await getProblemById(id);

			setIsLoading(false);
			setProblem(problem || null);
		};

		fetchData();
	}, [id]);

	if (isLoading) {
		return <Loader container />;
	}

	if (!problem) {
		return <NotFound message="Problem does not exist." />;
	}

	const { title, category, owner, status, description, solutionConditions, chestFund, id: problemId } = problem.data;

	const isOwner = problem?.data.owner.id === userCredentials?.binaryAddress;

	return (
		<div>
			<PageTitle>Problem</PageTitle>
			<Row justify="center" align="middle">
				<Col xs={24} sm={24} md={24} lg={18} xl={12}>
					<Card bordered={false}>
						<Title className="text-center" level={2} style={{ marginBottom: '0' }}>
							{title}
						</Title>

						<div className="text-center">
							<SmallText>Created on: {displayDate(problem.meta.createdAt)}</SmallText>
						</div>

						<Divider />

						<div className="text-center">
							<div style={{ display: 'flex', justifyContent: 'center', margin: '10px' }}>
								<div style={{ display: 'flex', gap: '3em' }}>
									<Entry label={capitalizeFirstLetter('Category')} value={categories[category]} />
									<Entry label={capitalizeFirstLetter('Owner')} value={owner.username} />
									<Entry label={capitalizeFirstLetter('Status')} value={`${status}`} />
								</div>
							</div>
						</div>

						<Divider />

						<Title className="text-center" level={4}>
							Description
						</Title>
						<Paragraph>
							<MDParser input={description} />
						</Paragraph>
						<Title className="text-center" level={4}>
							Solution Conditions
						</Title>
						<Paragraph>
							<MDParser input={solutionConditions} />
						</Paragraph>

						<Title className="text-center" level={4} style={{ marginBottom: '0', marginTop: '2em' }}>
							Token Reward
						</Title>
						<Title className="text-center" level={1} style={{ marginTop: '0', marginBottom: '1em' }}>
							{chestFund.toLocaleString()} {config.ticker}
						</Title>

						<div className="text-center">
							<SmallText>Last modified: {displayDate(problem.meta.lastModified)}</SmallText>
						</div>

						<Divider style={{ marginTop: '4em' }} />

						{status === 'open' ? (
							<div className="text-center">
								{isOwner ? (
									<Button type="dashed" onClick={() => navigate('/problems/edit/' + problemId)}>
										Edit Problem
									</Button>
								) : (
									<Button type="dashed" onClick={() => navigate('/solutions/add/' + problemId)}>
										Add a solution
									</Button>
								)}
							</div>
						) : (
							<div className="text-center">
								<strong>
									<Text style={{ opacity: '50%' }}>
										Marked as solved → <Link to={`/solutions/view/${problem.data.solvedBy}`}>View solution</Link>
									</Text>
								</strong>
							</div>
						)}
					</Card>

					<SolutionsForProblem problem={problem} />
				</Col>
			</Row>
		</div>
	);
};

export default ViewProblem;
