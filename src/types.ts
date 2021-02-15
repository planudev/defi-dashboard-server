import { ethers } from "ethers";
import { CoinGeckoAPI } from "./datasources/coingecko";
import { CreamFinanceAPI } from "./datasources/cream";
import { TrustWalletAPI } from "./datasources/trustwallet";
import { VenusAPI } from "./datasources/venus";

export enum BSCNetwork {
    Mainnet = 'mainnet',
    Testnet = 'testnet',
};

export enum BSCNetworkUri {
    Mainnet = 'https://bsc-dataseed4.ninicoin.io:443',
    Testnet = 'https://data-seed-prebsc-1-s1.binance.org:8545',
}

export enum ContractType {
    VENUS = 'venus',
    UNDERLYING = 'underlying',
    COMPTROLLER = 'Comptroller',
    PRICEORACLE = 'PriceOracle',
    VAI = 'VAI',
}

export interface CustomContext {
    bscProvider: ethers.providers.JsonRpcProvider;
}

export interface CustomDataSources {
    coingeckoAPI: CoinGeckoAPI;
    trustWalletAPI: TrustWalletAPI;
    venusAPI: VenusAPI;
    creamFinanceAPI: CreamFinanceAPI;
}

export interface CustomResolversContext extends CustomContext {
    dataSources: CustomDataSources;
}