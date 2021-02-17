import { ethers } from "ethers"
import { CoinGeckoAPI } from "./datasources/coingecko"
import { CreamFinanceAPI } from "./datasources/cream"
import { TrustWalletAPI } from "./datasources/trustwallet"
import { VenusAPI } from "./datasources/venus"
import { ForTubeAPI } from "./datasources/fortube";
import { CustomContext, CustomDataSources } from "./types"

export const dataSources: CustomDataSources = {
    coingeckoAPI: new CoinGeckoAPI(),
    trustWalletAPI: new TrustWalletAPI(),
    venusAPI: new VenusAPI(),
    creamFinanceAPI: new CreamFinanceAPI(),
    forTubeAPI: new ForTubeAPI(),
};

export const context: CustomContext = {
    bscProvider: new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/'),
}