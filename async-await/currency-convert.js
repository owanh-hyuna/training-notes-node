'use strict';
const axios = require('axios');

// Read .env vars into Node.
require('dotenv').config();

const getExchangeRate = async (from, to) => {
	try {
		const response = await axios.get(`${process.env.FIXER_API_BASE_URL}latest?access_key=${process.env.FIXER_API_KEY}`);
		const euro = 1 / response.data.rates[from];
		const rate = euro * response.data.rates[to];

		if (isNaN(rate)) {
			throw new Error();
		}
		return rate;
	} catch (error) {
		throw new Error(`Unable to get exchange rate for ${from} and ${to}.`);
	}
};

const getCountries = async currencyCode => {
	try {
		const response = await axios.get(`${process.env.REST_COUNTRIES_BASE_URL}currency/${currencyCode}`);
		return response.data.map(country => country.name);
	} catch (error) {
		throw new Error(`Unable to get countries that use ${currencyCode}.`);
	}
};

const convertCurrency = async (from, to, amount) => {
	const rate = await getExchangeRate(from, to);
	const convertedAmount = (amount * rate).toFixed(2);
	const countries = await getCountries(to);
	return `${amount} ${from} is worth ${convertedAmount} ${to}. You can spend it in the following countries: ${countries.join(', ')}`;
};

convertCurrency('USD', 'CAD', 20)
	.then(message => {
		console.log(message);
	})
	.catch(e => {
		console.log(e.message);
	});
