import { RESTDataSource } from 'apollo-datasource-rest';

type Price = string;

type CoinGeckoCoin = {
    id: string;
    symbol: string;
    name: string;
};

class CoinGeckoAPI extends RESTDataSource {
    private cacheCoinListsById: Record<string, CoinGeckoCoin>;
    private updatedAt: number;
    private gapBetweenEachUpdate: number;
    private getCoinRecordsPromise: Promise<Record<string, CoinGeckoCoin>> | undefined;

    constructor() {
        super();
        this.baseURL = 'https://api.coingecko.com/api/v3/';
        this.cacheCoinListsById = {};
        this.updatedAt = 0;
        this.gapBetweenEachUpdate = 500;
        this.getCoinRecordsPromise = undefined;
    }

    public async getPrice(symbol: string): Promise<Price> {
        if (this.isDataNeedRefresh()) {
            await this.refreshData();
        }

        const coin = this.cacheCoinListsById[symbol.toUpperCase()]
        if (coin == undefined) {
            return '0';
        }

        const params = {
            ids: coin.id,
            vs_currencies: 'usd',
        };

        const coinPrice = await this.get('simple/price', params);

        return coinPrice[Object.keys(coinPrice)[0]]['usd'];
    }

    private async getCoinRecords(): Promise<Record<string, CoinGeckoCoin>> {
        const coinLists: CoinGeckoCoin[] = await this.get('coins/list');
        let mappedCoinLists: Record<string, CoinGeckoCoin> = {};

        coinLists.forEach((coin: CoinGeckoCoin) => {
            mappedCoinLists[coin.symbol.toUpperCase()] = coin;
        });

        if (this.getCoinRecordsPromise != undefined) {
            this.getCoinRecordsPromise = Promise.resolve(mappedCoinLists);
            this.getCoinRecordsPromise = undefined;
        }

        return mappedCoinLists;
    }

    private async refreshData(): Promise<void> {
        if (this.getCoinRecordsPromise == undefined) {
            this.getCoinRecordsPromise = this.getCoinRecords();
        }

        this.cacheCoinListsById = await this.getCoinRecordsPromise;
        this.updatedAt = Date.now();
    }

    private isDataNeedRefresh(): boolean {
        return Date.now() - this.updatedAt >= this.gapBetweenEachUpdate;
    }
}

export { CoinGeckoAPI };