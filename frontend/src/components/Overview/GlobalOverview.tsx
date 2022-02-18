import dagre from 'dagre';
import { ReactElement, useEffect, useState } from 'react';
import ReactFlow, {
	Background,
	ConnectionLineType,
	Controls,
	Elements,
	isNode,
	MiniMap,
	Position,
	ReactFlowProvider,
} from 'react-flow-renderer';
import { useNavigate } from 'react-router-dom';

import { ChainState } from '../../types';
import { shortenString } from '../../utils/helpers';
import Loader from '../Generic/Loader';

type Props = { stateData: ChainState | undefined; isLoading: boolean };
type Node = {
	data?: { label: string };
	id: string;
	type?: string;
};

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 165;
const nodeHeight = 40;

const successColor = '#4cb418';

export default function GlobalOverview({ stateData, isLoading }: Props): ReactElement {
	const [elements, setElements] = useState<Elements>([]);
	const navigate = useNavigate();

	const handleClick = (path: string) => {
		navigate(path);
	};

	useEffect(() => {
		if (stateData) {
			const problemElements: Elements = stateData.problems.map(problem => {
				const isSolved = problem.data.solvedBy!!;
				const label = `${problem.data.title}${isSolved && ' ✔'}`;

				return {
					id: problem.data.id,
					data: { label: label },
					position: {
						x: 0,
						y: 20,
					},
					connectable: false,
					type: 'input',
					style: {
						background: isSolved ? successColor : '#c552a6',
						color: '#FFFFFF',
						border: '1px solid #552222',
						boxShadow: '1.8px 3.7px 3.7px hsl(0deg 0% 0% / 0.33)',
						width: nodeWidth,
					},
				};
			});

			const edgeElements: Elements = [];
			const solutionElements: Elements = [];

			stateData.solutions.forEach((solution, i) => {
				const isAcceptedSolution =
					stateData.problems.find(problem => problem.data.id === solution.data.problem.id)?.data.solvedBy ===
					solution.data.id;

				const label = `${shortenString(solution.data.description, 15)}${isAcceptedSolution ? ' ✔' : ''}`;

				edgeElements.push({
					id: 'e' + i,
					source: solution.data.problem.id,
					target: solution.data.id,
				});

				solutionElements.push({
					id: solution.data.id,
					data: { label: label },
					position: {
						x: 0,
						y: 0,
					},
					connectable: false,
					type: 'output',
					style: {
						background: isAcceptedSolution ? successColor : '#5280c5',
						color: '#FFFFFF',
						border: '1px solid #225522',
						boxShadow: '1.8px 3.7px 3.7px hsl(0deg 0% 0% / 0.33)',
						width: nodeWidth,
					},
				});
			});

			const newElements = [...problemElements, ...solutionElements, ...edgeElements];
			const layoutElements = getLayoutElements(newElements, 'TB');

			setElements(layoutElements);
		}
	}, [stateData]);

	const getLayoutElements = (elements: Elements, direction: string) => {
		const isHorizontal = direction === 'LR';
		dagreGraph.setGraph({ rankdir: direction, ranker: 'longest-path' });

		elements.forEach(el => {
			if (isNode(el)) {
				dagreGraph.setNode(el.id, { width: nodeWidth, height: nodeHeight });
			} else {
				dagreGraph.setEdge(el.source, el.target);
			}
		});

		dagre.layout(dagreGraph);

		return elements.map(el => {
			if (isNode(el)) {
				const nodeWithPosition = dagreGraph.node(el.id);
				el.targetPosition = isHorizontal ? Position.Left : Position.Top;
				el.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;
				let xpos = nodeWithPosition.x - nodeWidth / 2 + Math.random() / 1000;
				let ypos = nodeWithPosition.y - nodeHeight / 2;
				if (xpos > 1200) {
					xpos -= 1200;
					ypos += 80;
				}
				el.position = {
					x: xpos,
					y: ypos,
				};
			}

			return el;
		});
	};

	const nodeClicked = (element: Node) => {
		if (element.data) {
			const id = element.id;
			const page = element.type === 'input' ? 'problems' : 'solutions';
			const jumpTo = `/${page}/view/${id}`;
			handleClick(jumpTo);
		}
	};

	return (
		<div>
			<div className="overview">
				<div className="layoutflow">
					{isLoading ? (
						<Loader />
					) : (
						<ReactFlowProvider>
							{elements.length && (
								<ReactFlow
									elements={elements}
									connectionLineType={ConnectionLineType.SmoothStep}
									onElementClick={(_event: Object, element: Node) => nodeClicked(element)}
									onLoad={instance => instance.fitView()}
								>
									<MiniMap nodeStrokeWidth={3} />
									<Controls showInteractive={false} />
									<Background />
								</ReactFlow>
							)}
						</ReactFlowProvider>
					)}
				</div>
			</div>
		</div>
	);
}
