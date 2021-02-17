import { ForTubeContract } from './fortubeContract';
import { ForTubeTokenPrice } from './fortubeTokenPrice';
import { ForTubeMainnetAddress } from '../utils';
import { ForTubeToken } from '../../generated.types';


export class ForTubeTokenData {

    private contractCreator: ForTubeContract;
    private tokenPrice: ForTubeTokenPrice;
    private bankController: any;

    constructor(contractCreator: ForTubeContract) {
        this.contractCreator = contractCreator;
        this.tokenPrice = new ForTubeTokenPrice(this.contractCreator);
        this.bankController = undefined;
    }

    async getSupportedTokens(): Promise<string[]> {
        if ( !this.bankController )
            this.bankController = await this.createBankControllerContract();
        return await this.bankController.methods.getAllMarkets().call();
    }

    async getSupportedTokenData(userAddress: string = ''): Promise<ForTubeToken[]> {
        const supportedFTokens = await this.getSupportedTokens();
        return await Promise.all(
            supportedFTokens.map(async (supportedFToken) => {
                return await this.getTokenData(supportedFToken, userAddress);
            }
        ));
    }

    private async createBankControllerContract(): Promise<any> {
        return await this.contractCreator.createBankControllerContract(ForTubeMainnetAddress.BANKCONTROLLER);
    }

    private async getTokenData(fTokenAddress: string, userAddress: string = ''): Promise<ForTubeToken> {
        const token = await this.contractCreator.createFTokenContract(fTokenAddress);

        const name = await token.methods.name().call();
        const symbol = await token.methods.symbol().call();

        const [ priceUsd, decimals ] = await this.getPriceUsdAndDecimals(fTokenAddress);
        const [ underlyingAddress, underlyingName, underlyingSymbol ] = await this.getUnderlyingTokenData(token);

        let suppliedAmount = -1;
        let borrowedAmount = -1;
        if ( userAddress ) {
            // calculation's here...
        }

        const apy_ = await token.methods.APY().call();
        const apy = Number(apy_) / 10 ** Number(decimals) * 100;

        return {
            'id': fTokenAddress,
            'address': fTokenAddress,
            'name': name,
            'symbol': symbol,
            'decimals': Number(decimals),
            'price': priceUsd.toFixed(),
            'suppliedAmount': suppliedAmount.toFixed(),
            'borrowedAmount': borrowedAmount.toFixed(),
            'underlyingAddress': underlyingAddress,
            'underlyingName': underlyingName,
            'underlyingSymbol': underlyingSymbol,
            'borrowApy': apy.toFixed(),
            'supplyApy': apy.toFixed(),
        }
    }

    private async getPriceUsdAndDecimals(fTokenAddress: string): Promise<[Number, Number]> {
        if ( !this.tokenPrice )
            this.tokenPrice = await this.contractCreator.createPriceOracleContract(ForTubeMainnetAddress.PRICEORACLE);
        return await this.tokenPrice.getPriceUsdAndDecimals(fTokenAddress);
    }

    private async getUnderlyingTokenData(token: any): Promise<[string, string, string]> {
        const underlyingAddress = await token.methods.underlying().call();
        let underlyingName = 'BNB';
        let underlyingSymbol = 'BNB';
        if ( await this.isNotBNB(token) ) {
            const underlyingToken = await this.contractCreator.createUnderlyingContract(underlyingAddress);
            underlyingName = await underlyingToken.methods.name().call();
            underlyingSymbol = await underlyingToken.methods.symbol().call();
        }

        return [ underlyingAddress, underlyingName, underlyingSymbol ];
    }

    private async isNotBNB(token: any): Promise<boolean> {
        return ( await token.methods.symbol().call() ) != 'fBNB';
    }
}
