import { VenusContract } from './venusContract';
import { VenusTokenPrice } from './venusTokenPrice';
import { VenusToken } from '../../generated.types';
import { VenusTokensResponse, MainnetAddress } from './utils';
import { TrustWalletAPI } from '../trustwallet';
import { fetch } from 'cross-fetch';



export class VenusTokenData {

    private contractCreator: VenusContract;
    private tokenPrice: VenusTokenPrice;

    constructor(contractCreator: VenusContract) {
        this.contractCreator = contractCreator;
        this.tokenPrice = new VenusTokenPrice(this.contractCreator);
    }

    static async getSupportedTokens(): Promise<VenusToken[]> {
        const venusApiUri = 'https://api.venus.io/api/vtoken';
        const response: Response = await fetch(venusApiUri);
        
        if (!response.ok)
            throw new Error('getTokenError')

        const venusTokensResponse: VenusTokensResponse = await response.json();
        return venusTokensResponse.data.markets;
    }

    async getSupportedTokenData(address: string): Promise<VenusToken[]> {
        const supportedTokens = await VenusTokenData.getSupportedTokens();
        const markets = await this.getMarkets(address);
        const supportedTokenData = await Promise.all(
            supportedTokens.map(async (token) => {
                return await this.getTokenData(address, token, markets);
            }
        ));
        return supportedTokenData;
    }

    async getMarkets(address: string): Promise<string[]> {
        const comptroller = await this.contractCreator.createComptrollerContract(MainnetAddress.COMPTROLLER);
        return await comptroller.methods.getAssetsIn(address).call();
    }

    async getTokenData(address: string, token: VenusToken, markets: string[]): Promise<VenusToken> {
        const priceUsd = await this.tokenPrice.getPriceUsd(token.address);
        const contract = await this.contractCreator.createVenusContract(token.address);
        const decimals = await this.tokenPrice.getUnderlyingDecimals(token.address);
        const [suppliedBalance, borrowedBalance] = await this.getSuppliedAndBorrowedBalances(address, contract, decimals);
        const isCollateral = VenusTokenData.toLowercase(markets).includes(token.address);

        return this.tokenDataFormat(
            token,
            decimals,
            priceUsd,
            suppliedBalance,
            borrowedBalance,
            isCollateral,
        );
    }

    private static toLowercase(markets: string[]): string[] {
        return markets.map(market => market.toLowerCase());
    }

    private async getSuppliedAndBorrowedBalances(
        address: string,
        contract: any,
        decimals: Number,
    ): Promise<[Number, Number]> {
        let suppliedBalance = await contract.methods.balanceOfUnderlying(address).call();
        suppliedBalance = Number(suppliedBalance) / 10 ** Number(decimals);
        let borrowedBalance = await contract.methods.borrowBalanceCurrent(address).call();
        borrowedBalance = Number(borrowedBalance) / 10 ** Number(decimals);
        return [suppliedBalance, borrowedBalance];
    }

    private tokenDataFormat(
        token: VenusToken,
        decimals: Number,
        priceUsd: Number,
        suppliedBalance: Number,
        borrowedBalance: Number,
        isCollateral: boolean,
    ): VenusToken {
        return {
            'id': token.address,
            'address': token.address,
            'name': token.name,
            'symbol': token.symbol,
            'decimals': Number(decimals),
            'price': priceUsd.toString(),
            'suppliedAmount': suppliedBalance.toString(),
            'borrowedAmount': borrowedBalance.toString(),
            'isCollateral': isCollateral,
            'underlyingAddress': token.underlyingAddress,
            'underlyingName': token.underlyingName,
            'underlyingSymbol': token.underlyingSymbol,
            'borrowApy': token.borrowApy,
            'borrowVenusApy': token.borrowVenusApy,
            'supplyApy': token.supplyApy,
            'supplyVenusApy': token.supplyVenusApy,
        }
    }
}
