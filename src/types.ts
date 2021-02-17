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

export enum VenusContractType {
    VENUS = 'venus',
    UNDERLYING = 'underlying',
    COMPTROLLER = 'Comptroller',
    PRICE_ORACLE = 'PriceOracle',
    VAI = 'VAI',
}

export enum ForTubeContractType {
    FToken = 'FToken',
    UNDERLYING = 'Underlying',
    BANK_CONTROLLER = 'BankController',
    PRICE_ORACLE = 'PriceOracle',
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
