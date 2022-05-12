export const appMetadata = {
	name: "Dazzle Protocol",
    description: "Share tokens with Anyone",
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