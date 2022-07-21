import { request } from "../index";

const backendBaseURL = "https://dazzle-api.vercel.app"; //(window.location.hostname === 'localhost') ? "http://localhost:5000" : "https://dazzle-api.vercel.app";
const hederaBaseAPI = "https://testnet.mirrornode.hedera.com";

export async function getAccountInfo(accountId) {
    const response = await request({
        _baseURL: hederaBaseAPI,
        url: `/api/v1/accounts/${accountId}`,
        fname: 'getAccountInfo'
    });

    return response;
}

export async function getAccountTokens(accountId) {
    const response = await request({
        _baseURL: hederaBaseAPI,
        url: `/api/v1/tokens?account.id=${accountId}`,
        fname: 'getAccountTokens'
    });

    return response;
}

export async function getAccountNfts(accountId) {
    const response = await request({
        _baseURL: hederaBaseAPI,
        url: `/api/v1/accounts/${accountId}/nfts`,
        fname: 'getAccountNfts'
    });

    return response;
}

export async function getTokenInfo(tokenId) {
    const response = await request({
        _baseURL: hederaBaseAPI,
        url: `/api/v1/tokens/${tokenId}`,
        fname: 'getTokenInfo'
    });

    return response;
}

export async function getNftInfo(tokenId, serialNumber) {
    const response = await request({
        _baseURL: hederaBaseAPI,
        url: `/api/v1/tokens/${tokenId}/nfts/${serialNumber}`,
        fname: 'getTokenInfo'
    });

    return response;
}

export async function associateToken(data) {
    const response = await request({
        _baseURL: backendBaseURL,
        url: `/associateToken`,
        method: 'POST',
        fname: 'associateToken',
        data,
    });

    return response;
}

export async function setDeposit(data) {
    const response = await request({
        _baseURL: backendBaseURL,
        url: `/setDeposit`,
        method: 'POST',
        fname: 'setDeposit',
        data,
    });

    return response;
}

export async function validateClaim(data) {
    const response = await request({
        _baseURL: backendBaseURL,
        url: `/validateClaim`,
        method: 'POST',
        fname: 'validateClaim',
        data,
    });

    return response;
}

export async function executeClaim(data) {
    const response = await request({
        _baseURL: backendBaseURL,
        url: `/executeClaim`,
        method: 'POST',
        fname: 'executeClaim',
        data,
    });

    return response;
}

export async function executeClaimToken(data) {
    const response = await request({
        _baseURL: backendBaseURL,
        url: `/executeClaimToken`,
        method: 'POST',
        fname: 'executeClaimToken',
        data,
    });

    return response;
}

export async function generateNewWallet() {
    const response = await request({
        _baseURL: backendBaseURL,
        url: `/generateNewWallet`,
        method: 'POST',
        fname: 'generateNewWallet',
        data: {},
    });

    return response;
}