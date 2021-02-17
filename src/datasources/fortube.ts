import { ForTubeToken } from '../generated.types';
import { selectedNetwork } from './utils';
import { ForTubeContract } from './fortube-util/fortubeContract';
import { DataSource } from 'apollo-datasource';
import { ForTubeTokenData } from './fortube-util/fortubeTokenData';
import { Token } from 'graphql';


type ForTubeTokenDataCached = {
    tokenData: ForTubeToken[];
    timestamp: number;
};


const contractCreator: ForTubeContract = new ForTubeContract(selectedNetwork);


class ForTubeAPI<TContext = any> extends DataSource {
    
    private updateTime: number;
    private tokenDataCached: Record<string, ForTubeTokenDataCached>;
    private fortubeTokenData: ForTubeTokenData;

    constructor() {
        super();

        this.tokenDataCached = {};
        this.updateTime =  15 * (1000 * 60);  // 15 minutes
        this.fortubeTokenData = new ForTubeTokenData(contractCreator);
    }

    async getTotalSupplyBalance(address: string): Promise<string> {
        await this.updateTokenDataPeriod(address);
        const result = this.tokenDataCached[address]['tokenData'].reduce((prev: number, curr: ForTubeToken) => {
            return prev + ( Number(curr.suppliedAmount) * Number(curr.price) );
        }, 0);
        return result.toString();
    }

    async getTotalBorrowBalance(address: string): Promise<string> {
        await this.updateTokenDataPeriod(address);
        const result = this.tokenDataCached[address]['tokenData'].reduce((prev: number, curr: ForTubeToken) => {
            return prev + (Number(curr.borrowedAmount) * Number(curr.price) );
        }, 0);
        return result.toString();
    }

    async getSuppliedTokens(address: string): Promise<ForTubeToken[]> {
        await this.updateTokenDataPeriod(address);
        return this.tokenDataCached[address]['tokenData'].filter((element: ForTubeToken) => {
            return Number(element.suppliedAmount) > 0;
        });
    }

    async getBorrowedTokens(address: string): Promise<ForTubeToken[]> {
        await this.updateTokenDataPeriod(address);
        return this.tokenDataCached[address]['tokenData'].filter((element: ForTubeToken) => {
            return Number(element.borrowedAmount) > 0;
        });
    }

    public async getSupportTokens(): Promise<ForTubeToken[]> {
        const supportedTokenData = await this.getSupportedTokenData();
        return supportedTokenData.map((tokenData: ForTubeToken) => {
            delete tokenData.suppliedAmount;
            delete tokenData.borrowedAmount;
            return tokenData;
        });
    }

    private async updateTokenDataPeriod(address: string): Promise<void> {
        const addressInCache = address in this.tokenDataCached;
        if (!addressInCache)
            this.tokenDataCached[address] = { 'tokenData': [], 'timestamp': 0 };
        if (this.checkTimestamp(address)) {
            const supportedTokenData = await this.getSupportedTokenData(address);
            this.tokenDataCached[address]['tokenData'] = supportedTokenData;
            this.tokenDataCached[address]['timestamp'] = Date.now();
        }
    }

    private checkTimestamp(address: string): boolean {
        return Date.now() - this.tokenDataCached[address]['timestamp'] >= this.updateTime;
    }

    private async getSupportedTokenData(address: string = ''): Promise<ForTubeToken[]> {
        return await this.fortubeTokenData.getSupportedTokenData(address);
    }
}

export { ForTubeAPI };


async function main() {
    const address = '0x773A0f4903d572cBF929dD94e7261C7F554b6D4f';
    const fortubeApi = new ForTubeAPI();
    console.log(await fortubeApi.getTotalSupplyBalance(address));
    console.log(await fortubeApi.getTotalBorrowBalance(address));
    console.log(await fortubeApi.getSuppliedTokens(address));
    console.log(await fortubeApi.getBorrowedTokens(address));
    // console.log(await fortubeApi.getSupportTokens());
}
main().catch(console.error);
