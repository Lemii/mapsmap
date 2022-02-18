import countries from 'i18n-iso-countries';

export const isValidIsoCode = (code: string) => countries.isValid(code);

export const validateContacts = (buff: Buffer) => {
	const allowedKeys = ['discord', 'telegram', 'twitter'];

	const contacts: unknown = JSON.parse(buff.toString());

	Object.keys(contacts as { [key: string]: string }).forEach(type => {
		if (!allowedKeys.includes(type)) {
			throw new Error(`${type} is not a valid contact type.`);
		}
	});
};
