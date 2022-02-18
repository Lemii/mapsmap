import { Problem, Solution, TagCloudData } from '../../types';

export const generateTagCloudData = (data: Problem[] | Solution[]): TagCloudData => {
	// Build concatenated word list
	const words: string[] = [];

	for (const entity of data) {
		for (const tag of entity.data.tags) {
			words.push(tag.toLocaleLowerCase());
		}
	}

	// Count words
	const countMap: { [key: string]: number } = {};

	words.forEach(word => {
		if (countMap[word]) {
			countMap[word] += 1;
		} else {
			countMap[word] = 1;
		}
	});

	return Object.entries(countMap).map(([value, count]) => ({ value, count }));
};
