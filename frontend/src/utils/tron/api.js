import { request } from "../index";

const backendBaseURL = "http://localhost:5000"; //(window.location.hostname === 'localhost') ? "http://localhost:5000" : "https://dazzle-api.vercel.app";
const trongridBaseAPI = "https://nile.trongrid.io/";

export async function getAccountInfo(address) {
    const response = await request({
        _baseURL: trongridBaseAPI,
        url: `/v1/accounts/${address}`,
        fname: 'getAccountInfo'
    });

    return response;
}