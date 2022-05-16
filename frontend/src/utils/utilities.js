export const contractId = "0.0.34822145";
export const currentNetwork = "testnet";
export const backendBaseURL = "http://localhost:5000";
export const hederaBaseAPI = "https://testnet.mirrornode.hedera.com";

export const appMetadata = {
	name: "Dazzle Protocol",
    description: "An easy first step into DeFi - Share tokens with Anyone",
    icon: "https://res.cloudinary.com/dy3hbcg2h/image/upload/v1652131690/dz-logo-black_c86gzb.png"
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
	const hashHex = hashArray
		.map((bytes) => bytes.toString(16).padStart(2, '0'))
		.join('');
	return hashHex;
}