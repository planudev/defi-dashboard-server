import { ForTubeContract } from './fortubeContract';
import { ForTubeMainnetAddress } from '../utils';


export class ForTubeTokenPrice {

    private contractCreator: ForTubeContract;
    private priceOracle: any;

    constructor(contractCreator: ForTubeContract) {
        this.contractCreator = contractCreator;
        this.priceOracle = undefined;
    }

    async getPriceUsdAndDecimals(fTokenAddress: string): Promise<[Number, Number]> {
        if (this.priceOracleNotCreated()) {
            this.priceOracle = await this.contractCreator.createPriceOracleContract(ForTubeMainnetAddress.PRICE_ORACLE);
        }

        const token = await this.contractCreator.createFTokenContract(fTokenAddress);
        const decimals = await token.methods.decimals().call();
        const underlyingAddress = await token.methods.underlying().call();
        const price = await this.getPrice(underlyingAddress);

        return [Number(price) / 10 ** Number(decimals), decimals];
    }
    
    private priceOracleNotCreated(): boolean {
        return this.priceOracle === undefined;
    }

    private async getPrice(fTokenAddress: string): Promise<string> {
        return await this.priceOracle.methods.getPrice(fTokenAddress).call();
    }
}
