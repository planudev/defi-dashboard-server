import { CoinGeckoCoinsResponse } from './types';
import { fetch } from 'cross-fetch';

export const url = {
    '/coins/list': 'https://api.coingecko.com/api/v3/coins/list',
    '/simple/price': 'https://api.coingecko.com/api/v3/simple/price',
};

export async function getCoinsFromCoinGecko(): Promise<CoinGeckoCoinsResponse[]> {
    const response: Response = await fetch(url["/coins/list"]);
    
    if (!response.ok) {
        throw new Error(await response.text())
    }

    const coins: CoinGeckoCoinsResponse[] = await response.json();
    return coins;
}

export async function getPriceByCoinGeckoId(coinId: string): Promise<string> {
    if (coinId == undefined) {
        return '0';
    }
    const params = {ids: coinId, vs_currencies: 'usd'}
    var getPriceUrl = new URL(url['/simple/price']);
    getPriceUrl.search = new URLSearchParams(params).toString();
    const response: Response = await fetch(getPriceUrl.toString());

    if (!response.ok) {
        throw new Error(await response.text())
    }

    const priceResponse = await response.json();
    return priceResponse[Object.keys(priceResponse)[0]]['usd'];
}