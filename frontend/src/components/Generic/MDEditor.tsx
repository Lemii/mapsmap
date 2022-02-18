import './MDEditor.css';
import 'react-markdown-editor-lite/lib/index.css';

import MarkdownIt from 'markdown-it';
import { useState } from 'react';
import { isMobile } from 'react-device-detect';
import MdEditor from 'react-markdown-editor-lite';

import SmallText from './SmallText';

const mdParser = new MarkdownIt();

type Props = {
	height?: string;
	onChange?: any;
	initialValue?: string;
	charLimit: number;
};

const MDEditor = ({ height = '200px', onChange, initialValue = '', charLimit }: Props) => {
	const [input, setInput] = useState(initialValue);

	function handleEditorChange({ text }: { text: string }) {
		if (text.length > charLimit) {
			return;
		}

		setInput(text);
		onChange(text);
	}

	const getOptions = () =>
		isMobile
			? { view: { menu: true, md: true, html: false } } //
			: { view: { menu: true, md: true, html: true } };

	return (
		<div>
			<MdEditor
				config={getOptions()}
				className="custom-bg"
				style={{ height }}
				renderHTML={text => mdParser.render(text)}
				onChange={handleEditorChange}
				value={input}
			/>

			<div style={{ display: 'flex', justifyContent: 'right' }}>
				<SmallText>
					{input.length} / {charLimit}
				</SmallText>
			</div>
		</div>
	);
};

export default MDEditor;
