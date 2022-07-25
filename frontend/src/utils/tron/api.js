import { request } from "../index";

const backendBaseURL = (window.location.hostname === 'localhost') ? "http://localhost:5000" : "https://dazzle-api.vercel.app";
const trongridBaseAPI = "https://nile.trongrid.io/";

export async function getAccountInfo(address) {
    const response = await request({
        _baseURL: trongridBaseAPI,
        url: `/v1/accounts/${address}`,
        fname: 'getAccountInfo'
    });

    return response;
}

export async function executeClaimTron(data) {
    const response = await request({
        _baseURL: backendBaseURL,
        url: `/executeClaimTron`,
        method: 'POST',
        fname: 'executeClaimTron',
        data,
    });

    return response;
}

export async function deployBaseWallet(data) {
    const response = await request({
        _baseURL: backendBaseURL,
        url: `/deployBaseWallet`,
        method: 'POST',
        fname: 'deployBaseWallet',
        data,
    });

    return response;
}

export async function withdrawFromSmartwallet(data) {
    const response = await request({
        _baseURL: backendBaseURL,
        url: `/withdrawFromSmartwallet`,
        method: 'POST',
        fname: 'withdrawFromSmartwallet',
        data,
    });

    return response;
}