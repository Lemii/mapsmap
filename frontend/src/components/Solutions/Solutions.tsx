import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { ReactElement, useContext, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { Link } from 'react-router-dom';

import { UserContext } from '../../contexts/userContext';
import { getState } from '../../services/api';
import { OwnerReference, ProblemReference, Timestamp } from '../../types';
import { displayDate, shortenString } from '../../utils/helpers';
import PageTitle from '../Generic/PageTitle';
import SolutionWordCloud from './SolutionsWordCloud';

type TableData = {
	key: number;
	description: string;
	problem: ProblemReference;
	owner: OwnerReference;
	date: Timestamp;
	status: string;
	id: string;
	isOwner: boolean;
};

const columns: ColumnsType<TableData> = [
	{
		title: 'Description',
		dataIndex: 'description',
		key: 'description',
		render: (text, record) => <Link to={'/solutions/view/' + record.id}>{text}</Link>,
	},
	{
		title: 'Attached to problem',
		dataIndex: 'problem',
		key: 'problem',
		render: (_text, record) => <Link to={'/problems/view/' + record.problem.id}>{record.problem.title}</Link>,
		width: isMobile ? '175px' : '200px',
	},
	{
		title: 'Owner',
		dataIndex: 'owner',
		key: 'owner',
		responsive: ['md'],
		render: (_text, record) => <Link to={'/persons/view/' + record.owner.id}>{record.owner.username}</Link>,
	},
	{
		title: 'Date',
		dataIndex: 'date',
		key: 'date',
		responsive: ['xl'],
		defaultSortOrder: 'ascend',
		sortDirections: ['ascend', 'descend', 'ascend'],
		sorter: (a, b) => a.date.unix - b.date.unix,
		render: (text: Timestamp) => <div>{displayDate(text)}</div>,
	},
	{
		title: 'Status',
		dataIndex: 'status',
		key: 'status',
		sortDirections: ['ascend', 'descend', 'ascend'],
		sorter: (a, b) => a.status.localeCompare(b.status),
		width: isMobile ? '75px' : '100px',
	},
	{
		title: 'Action',
		key: 'category',
		dataIndex: 'isOwner',
		responsive: ['lg'],
		render: (isOwner: boolean, record) => {
			if (record.status === 'N/A' || !isOwner) {
				return 'N/A';
			}

			return <Link to={`/solutions/edit/${record.id}`}>Edit Solution</Link>;
		},
	},
];

const Solutions = (): ReactElement => {
	const [tableData, setTableData] = useState<TableData[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [showCloud, setShowCloud] = useState(true);

	const { userCredentials } = useContext(UserContext);

	useEffect(() => {
		const fetchData = async () => {
			const stateData = await getState();

			const newTableData: TableData[] = [];

			stateData.solutions.forEach((solution, i) => {
				const problem = stateData.problems.find(problem => problem.data.id === solution.data.problem.id);
				const isAcceptedSolution = problem?.data.solvedBy === solution.data.id;
				const status = isAcceptedSolution ? 'Accepted solution' : problem?.data.solvedBy ? 'N/A' : 'Open';

				newTableData.push({
					key: i,
					id: solution.data.id,
					description: shortenString(solution.data.description, 60),
					problem: solution.data.problem,
					owner: solution.data.owner,
					date: solution.meta.createdAt,
					status,
					isOwner: solution.data.owner.id === userCredentials?.binaryAddress,
				});
			});

			setTableData(newTableData.reverse());
			setIsLoading(false);
		};

		fetchData();
	}, [userCredentials?.binaryAddress]);

	const handleCloseCloud = () => {
		setShowCloud(false);
	};

	return (
		<div>
			<PageTitle>Solutions</PageTitle>

			{showCloud && <SolutionWordCloud closeHandler={handleCloseCloud} />}

			<div className="solutionsList">
				<Table columns={columns} dataSource={tableData} loading={isLoading} />
			</div>
		</div>
	);
};

export default Solutions;
