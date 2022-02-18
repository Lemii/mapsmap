type Contacts = { [key: string]: string };

export const jsonToBuffer = (contacts: Contacts) => {
	const stringified = JSON.stringify(contacts);
	return Buffer.from(stringified);
};

export const bufferToJson = (buffer: Buffer): Contacts => {
	const bufferAsString = buffer.toString();
	return JSON.parse(bufferAsString);
};
