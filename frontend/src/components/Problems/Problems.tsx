import { Button, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { ReactElement, useContext, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { Link, useNavigate } from 'react-router-dom';

import config from '../../config';
import { UserContext } from '../../contexts/userContext';
import { getProblems } from '../../services/api';
import { OwnerReference, Timestamp } from '../../types';
import { capitalizeFirstLetter, displayDate } from '../../utils/helpers';
import PageTitle from '../Generic/PageTitle';
import { categories } from './categories';
import ProblemWordCloud from './ProblemsWordCloud';

type TableData = {
	id: string;
	key: number;
	title: string;
	category: string;
	chestFund: number;
	owner: OwnerReference;
	date: Timestamp;
	isOwner: boolean;
	status: string;
};

const columns: ColumnsType<TableData> = [
	{
		title: 'Title',
		dataIndex: 'title',
		key: 'title',
		render: (_text, record) => <Link to={'/problems/view/' + record.id}>{record.title}</Link>,
		width: isMobile ? '175px' : '200px',
	},
	{
		title: 'Category',
		dataIndex: 'category',
		key: 'category',
	},
	{
		title: 'Chest fund',
		dataIndex: 'chestFund',
		key: 'chestFund',
		responsive: ['lg'],
		sortDirections: ['ascend', 'descend', 'ascend'],
		sorter: (a, b) => a.chestFund - b.chestFund,
		render: (amount: number) => (
			<>
				<strong>{amount.toLocaleString()}</strong> {config.ticker}
			</>
		),
	},
	{
		title: 'Owner',
		dataIndex: 'owner',
		key: 'owner',
		responsive: ['md'],
		render: (_text, record) => <Link to={'/persons/view/' + record.owner.id}>{record.owner.username}</Link>,
	},
	{
		title: 'Date created',
		dataIndex: 'date',
		key: 'date',
		responsive: ['xl'],
		defaultSortOrder: 'ascend',
		sortDirections: ['ascend', 'descend', 'ascend'],
		sorter: (a, b) => a.date.unix - b.date.unix,
		render: (text: Timestamp) => <div>{displayDate(text)}</div>,
		width: '225px',
	},
	{
		title: 'Status',
		dataIndex: 'status',
		key: 'status',
		sortDirections: ['ascend', 'descend', 'ascend'],
		sorter: (a, b) => a.status.localeCompare(b.status),
		render: (text: string) => capitalizeFirstLetter(text),
		width: isMobile ? '75px' : '100px',
	},
	{
		title: 'Action',
		key: 'category',
		dataIndex: 'isOwner',
		responsive: ['lg'],
		render: (isOwner: boolean, record) => {
			if (record.status === 'solved') {
				return 'N/A';
			}
			return isOwner ? (
				<Link to={`/problems/edit/${record.id}`}>Edit Problem</Link>
			) : (
				<Link to={`/solutions/add/${record.id}`}>Add Solution</Link>
			);
		},
	},
];

const Problems = (): ReactElement => {
	const [tableData, setTableData] = useState<TableData[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [showCloud, setShowCloud] = useState(true);
	const navigate = useNavigate();
	const { userCredentials } = useContext(UserContext);

	useEffect(() => {
		const fetchData = async () => {
			const data = await getProblems();

			const tableData = data.map((item, i) => {
				return {
					key: i,
					title: item.data.title,
					category: categories[item.data.category],
					chestFund: item.data.chestFund,
					owner: item.data.owner,
					id: item.data.id,
					date: item.meta.createdAt,
					status: item.data.status,
					isOwner: item.data.owner.id === userCredentials?.binaryAddress,
				};
			});

			setTableData(tableData.reverse());
			setIsLoading(false);
		};

		fetchData();
	}, [userCredentials?.binaryAddress]);

	const handleCloseCloud = () => {
		setShowCloud(false);
	};

	const handleAddProblem = () => {
		navigate('/problems/add');
	};

	return (
		<>
			<PageTitle>Problems</PageTitle>

			{showCloud && <ProblemWordCloud closeHandler={handleCloseCloud} />}

			<Table columns={columns} dataSource={tableData} loading={isLoading} tableLayout="fixed" />

			<div className="text-center" style={{ marginTop: '2em' }}>
				<Button onClick={handleAddProblem} size="large" type="primary">
					Add Your Own Problem
				</Button>
			</div>
		</>
	);
};

export default Problems;
