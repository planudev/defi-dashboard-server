import { VenusContract } from './venusContract';
import { VenusMainnetAddress } from '../utils';


export class VenusTokenPrice {

    private contractCreator: VenusContract;

    constructor(contractCreator: VenusContract) {
        this.contractCreator = contractCreator;
    }

    async getPriceUsd(vTokenAddress: string): Promise<Number> {
        const price = await this.getPrice(vTokenAddress);
        const underlyingDecimals = await this.getUnderlyingDecimals(vTokenAddress);
        const priceUsd = Number(price) / 10 ** Number(underlyingDecimals);
        return priceUsd;
    }

    async getUnderlyingDecimals(vTokenAddress: string): Promise<Number> {
        const vTokenContract = await this.contractCreator.createVenusContract(vTokenAddress);
        if ( this.isBNB(vTokenContract) )
            return 18;

        const underlyingAddress = await vTokenContract.methods.underlying().call();
        const underlyingContract = await this.contractCreator.createUnderlyingContract(underlyingAddress);
        return Number(await underlyingContract.methods.decimals().call());
    }
    
    private async getPrice(vTokenAddress: string): Promise<string> {
        const priceContract = await this.contractCreator.createPriceOracleContract(VenusMainnetAddress.PRICEORACLE);
        return await priceContract.methods.getUnderlyingPrice(vTokenAddress).call();
    }

    private async isBNB(vTokenContract: any): Promise<boolean> {
        return await vTokenContract.methods.symbol().call() == "vBNB";
    }
}
