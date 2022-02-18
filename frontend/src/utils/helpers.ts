import { transactions } from '@liskhq/lisk-client';
import countries from 'i18n-iso-countries';
import moment from 'moment';

import { Timestamp } from '../types';

countries.registerLocale(require('i18n-iso-countries/langs/en.json'));

export const capitalizeFirstLetter = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

export const shortenString = (text: string, size: number = 30) => {
	if (text.length < size) {
		return text;
	}

	return text.substring(0, size) + '..';
};

export const getCountryName = (code: string) => countries.getName(code, 'en');

export const displayDate = (time: Timestamp) => moment(time.human).format('MMMM Do YYYY, HH:mm:ss');

export const getBalance = (balance: BigInt) =>
	Number(transactions.convertBeddowsToLSK(balance.toString())).toLocaleString();
