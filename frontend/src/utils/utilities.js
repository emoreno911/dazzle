import axios from 'axios';

export const appMetadata = {
	name: "Dazzle Protocol",
    description: "Share tokens with Anyone",
    icon: "https://res.cloudinary.com/dy3hbcg2h/image/upload/v1652131690/dz-logo-black_c86gzb.png"
}

const backendBaseURL = "http://localhost:5000";

export const request = async ({url, fname, method = 'GET', data = null, _baseURL = null}) => {
	const instance = axios.create();
	const baseURL = _baseURL || backendBaseURL;
	return instance.request({
		baseURL,
		url,
		method,
		data
	})
	.then(response => response.data)
	.catch(err => {
		const { message, response:{data, status} } = err;
		console.log('request error in' + `%c ${fname}`, 'font-weight:900');
		console.log(message);
		return { err: true, errmsg: message, ...data };
	})
}

export const formatNumber = (number) => {
	return new Intl.NumberFormat().format(number)
}

export const formatMoney = (amount) => {
	return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

export const toNumber = (num) => {
	return num * 1
}

export const toFixedIfNecessary = ( value, dp ) => {
  return +parseFloat(value).toFixed( dp );
}