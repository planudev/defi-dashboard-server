import { ethers } from "ethers"
import { CoinGeckoAPI } from "./datasources/coingecko"
import { CreamFinanceAPI } from "./datasources/cream"
import { TrustWalletAPI } from "./datasources/trustwallet"
import { VenusAPI } from "./datasources/venus"

export type Context = {
    dataSources: IDataSources;
    bscProvider: ethers.providers.JsonRpcProvider;
}

export type IDataSources = {
    coingeckoAPI: CoinGeckoAPI;
    trustWalletAPI: TrustWalletAPI;
    venusAPI: VenusAPI;
    creamFinanceAPI: CreamFinanceAPI;
}

export const context: Context = {
    dataSources: {
        coingeckoAPI: new CoinGeckoAPI(),
        trustWalletAPI: new TrustWalletAPI(),
        venusAPI: new VenusAPI(),
        creamFinanceAPI: new CreamFinanceAPI(),
    },
    bscProvider: new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/'),
}