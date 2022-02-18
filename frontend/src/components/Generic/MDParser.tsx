import ReactMarkdown from 'react-markdown';

type Props = {
	input: string;
};

const MDParser = ({ input }: Props) => {
	return (
		<div className="md-text">
			<ReactMarkdown>{input}</ReactMarkdown>
		</div>
	);
};

export default MDParser;
