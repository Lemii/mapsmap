import { Button, Card, Col, Divider, Row, Space, Typography } from 'antd';
import { ReactElement, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { UserContext } from '../../contexts/userContext';
import config from '../../config';

const { Title, Paragraph } = Typography;

const Home = (): ReactElement => {
	const navigate = useNavigate();
	const { userCredentials } = useContext(UserContext);
	const isLoggedIn = userCredentials!!;

	const handleClick = (path: string) => {
		navigate(path);
	};

	return (
		<div>
			<Row justify="center" align="middle">
				<Col xs={24} sm={24} md={24} lg={12} xl={12}>
					<Card bordered={false}>
						<Title className="text-center">We want your problems!</Title>
						<Title level={2}>At MapsMap we connect Persons with Problems to Persons with Solutions</Title>
						<Paragraph>
							Mapsmap uses blockchain technology to connect individuals, companies and organizations who face certain
							problems to others who have the solutions. Any person can be rewarded for finding and sharing a solution.
						</Paragraph>
						<Paragraph>
							To get started <Link to="/persons/add">signup</Link> for a new account, if you have an account{' '}
							<Link to="/persons/sign-in">sign in</Link>. Or check out the <Link to="/overview">Overview</Link> of a map
							of all the Problems and Solutions on the chain.
						</Paragraph>
						<Paragraph>
							After you created an account, you can add <Link to="/problems/add">new problems</Link> or add a solution
							to an <Link to="/solutions">existing problem</Link>.
						</Paragraph>
						<Paragraph>
							When creating a problem you can lock tokens from your balance in the chest fund and others can post a
							solution to your problem. As the problem owner you can choose the best solution. The solution owner will
							receive all the {config.ticker} tokens in the chest fund.
						</Paragraph>
						<Divider />

						<div className="text-center">
							{isLoggedIn ? (
								<Space size="large">
									<Button type="primary" size="large" onClick={() => handleClick('/problems/add')}>
										Add a problem
									</Button>
									<Button size="large" onClick={() => handleClick('/persons/view/me')}>
										View account
									</Button>
								</Space>
							) : (
								<Space size="large">
									<Button type="primary" size="large" onClick={() => handleClick('/persons/sign-in')}>
										Sign in
									</Button>
									<Button size="large" onClick={() => handleClick('/persons/add')}>
										Create a new account
									</Button>
								</Space>
							)}
						</div>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default Home;
