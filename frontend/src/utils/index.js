import axios from "axios";

export const request = async ({url, fname, method = 'GET', data = null, _baseURL = null}) => {
	const instance = axios.create();
	const baseURL = _baseURL;
	return instance.request({
		baseURL,
		url,
		method,
		data
	})
	.then(response => response.data)
	.catch(err => {
		const { message, response:{data, status} } = err;
		console.log(`request error in %c ${fname}`, 'font-weight:900');
		console.log(message);
		return { err: true, errmsg: message, ...data };
	})
}

export const appMetadata = {
	name: "Dazzle Protocol",
    description: "An easy first step into DeFi - Share tokens with Anyone",
    icon: "https://res.cloudinary.com/dy3hbcg2h/image/upload/v1652131690/dz-logo-black_c86gzb.png"
}

export const delay = (ms) => {
	return new Promise((resolve) => setTimeout(() => resolve(), ms))
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

export const makeHash = async (string) => {
	const utf8 = new TextEncoder().encode(string);
	const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	/*const hashHex = hashArray
		.map((bytes) => bytes.toString(16).padStart(2, '0'))
		.join('');*/
	return hashArray;
}

export const isNullAddress = (addr) => {
	return addr === "0x0000000000000000000000000000000000000000" || addr === "410000000000000000000000000000000000000000"
}

export const divideByDecimals = (num, decimals) => {
	const divider = parseInt(`1${Array(decimals).fill(0).join('')}`);
	return toFixedIfNecessary(num/divider, 8);
}

export const multiplyByDecimals = (num, decimals) => {
	const multiplier = parseInt(`1${Array(decimals).fill(0).join('')}`);
	return toFixedIfNecessary(num*multiplier, 8);
}

export const storeLocalDeposit = (depositId, amount, token, txid, network) => {
	const storeName = "dazzle-deposits";
	const obj = { depositId, amount, token, txid, network };
	
	let existing = localStorage.getItem(storeName);
	let arr = existing === null ? [] : JSON.parse(existing);
	arr.push(obj);
	localStorage.setItem(storeName, JSON.stringify(arr));
}

window.listDeposits = () => {
	const storeName = "dazzle-deposits";
	let existing = localStorage.getItem(storeName);
	let arr = JSON.parse(existing);
	let view = arr.map((o,i) => `\n${i+1}) ${o.depositId} | ${o.token} | ${o.amount}`)
	console.log(view.join(''))
	return true
}