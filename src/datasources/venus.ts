import { DataSource } from 'apollo-datasource';
import { VenusToken } from '../generated.types';
import { fetch } from 'cross-fetch';

type VenusTokensResponse = {
    status: boolean;
    data: VenusTokensResponseData;
}

type VenusTokensResponseData = {
    markets: VenusToken[];
}

class VenusAPI<TContext = any> extends DataSource {
    constructor() {
        super();
    }

    async getTotalSupplyBalance(address: string): Promise<string> {
        // TODO [#3]: return supply balance from venus by account
        return '0';
    }

    async getTotalBorrowBalance(address: string): Promise<string> {
        // TODO [#4]: return borrow balance from venus by account
        return '0';
    }

    async getSuppliedTokens(address: string): Promise<VenusToken[]> {
        // TODO [#5]: return all of supplied tokens by address
        return [];
    }

    async getBorrowedTokens(address: string): Promise<VenusToken[]> {
        // TODO [#6]: return all of borrowed tokens by address
        return [];
    }

    async getVAIMintedAmount(address: string): Promise<string> {
        // TODO [#9]: return vai minted amount
        return '0'
    }

    async getSupportTokens(): Promise<VenusToken[]> {
        const venusAPIUri = 'https://api.venus.io/api/vtoken';
        const response: Response = await fetch(venusAPIUri);
        
        if (!response.ok) {
            throw new Error('getTokenError')
        }

        const venusTokensResponse: VenusTokensResponse = await response.json();
        return venusTokensResponse.data.markets;
    }
}

export { VenusAPI };