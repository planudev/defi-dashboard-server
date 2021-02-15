import { DataSource } from 'apollo-datasource';
import { selectedNetwork } from './venus-util/utils';
import { VAITokenData } from './venus-util/vaiTokenData';
import { VenusTokenData } from './venus-util/venusTokenData';
import { VenusContract } from './venus-util/venusContract';
import { VenusToken } from '../generated.types';
import { Token } from 'graphql';


type TokenDataCached = {
    tokenData: VenusToken[];
    timestamp: number;
};


const contractCreator: VenusContract = new VenusContract(selectedNetwork);


class VenusAPI<TContext = any> extends DataSource {
    
    private updateTime: number;
    private tokenDataCached: Record<string, TokenDataCached>;
    private venusTokenData: VenusTokenData;
    private vaiTokenData: VAITokenData;

    constructor() {
        super();

        this.tokenDataCached = {};
        this.updateTime =  15 * (1000 * 60);  // 15 minutes
        this.venusTokenData = new VenusTokenData(contractCreator);
        this.vaiTokenData = new VAITokenData(contractCreator)
    }

    async getTotalSupplyBalance(address: string): Promise<string> {
        await this.updateTokenDataPeriod(address);
        const result = this.tokenDataCached[address]['tokenData'].reduce((prev: number, curr: VenusToken) => {
            return prev + ( Number(curr.suppliedAmount) * Number(curr.price) );
        }, 0);
        return result.toString();
    }

    async getTotalBorrowBalance(address: string): Promise<string> {
        await this.updateTokenDataPeriod(address);
        const result = this.tokenDataCached[address]['tokenData'].reduce((prev: number, curr: VenusToken) => {
            return prev + (Number(curr.borrowedAmount) * Number(curr.price) );
        }, 0);
        return result.toString();
    }

    async getSuppliedTokens(address: string): Promise<VenusToken[]> {
        await this.updateTokenDataPeriod(address);
        return this.tokenDataCached[address]['tokenData'].filter((element: VenusToken) => {
            return Number(element.suppliedAmount) > 0;
        }, 0);
    }

    async getBorrowedTokens(address: string): Promise<VenusToken[]> {
        await this.updateTokenDataPeriod(address);
        return this.tokenDataCached[address]['tokenData'].filter((element: VenusToken) => {
            return Number(element.borrowedAmount) > 0;
        }, 0);
    }

    async getVAIMintedAmount(address: string): Promise<string> {
        return (await this.vaiTokenData.balanceOf(address)).toString();
    }

    private async updateTokenDataPeriod(address: string): Promise<void> {
        const addressInCache = address in this.tokenDataCached;
        if (!addressInCache)
            this.tokenDataCached[address] = { 'tokenData': [], 'timestamp': 0 };
        if (this.checkTimestamp(address)) {
            const supportedTokenData = await this.venusTokenData.getSupportedTokenData(address);
            this.tokenDataCached[address]['tokenData'] = supportedTokenData;
            this.tokenDataCached[address]['timestamp'] = Date.now();
        }
    }

    private checkTimestamp(address: string): boolean {
        return Date.now() - this.tokenDataCached[address]['timestamp'] >= this.updateTime;
    }

}

export { VenusAPI };


// async function main() {
//     const address = '0x1ca3Ac3686071be692be7f1FBeCd668641476D7e';
//     const venusApi = new VenusAPI();
//     console.log(await venusApi.getTotalSupplyBalance(address));
//     console.log(await venusApi.getTotalBorrowBalance(address));
//     console.log(await venusApi.getSuppliedTokens(address));
//     console.log(await venusApi.getBorrowedTokens(address));
//     console.log(await venusApi.getVAIMintedAmount(address));
// }
// main().catch(console.error);
