import { DataSource } from 'apollo-datasource';
import { VenusToken } from '../generated.types';

class VenusAPI<TContext = any> extends DataSource {
    constructor() {
        super();
    }

    async getTotalSupplyBalance(address: string): Promise<string> {
        // TODO [#3]: return supply balance from venus by account
        return '';
    }

    async getTotalBorrowBalance(address: string): Promise<string> {
        // TODO [#4]: return borrow balance from venus by account
        return '';
    }

    async getSuppliedTokens(address: string): Promise<VenusToken[]> {
        // TODO [#5]: return all of supplied tokens by address
        return [];
    }

    async getBorrowedTokens(address: string): Promise<VenusToken[]> {
        // TODO [#6]: return all of borrowed tokens by address
        return [];
    }

    async getSupportSupplyTokens(): Promise<VenusToken[]> {
        // TODO [#7]: return all of supported supply tokens
        return [];
    }

    async getSupportBorrowTokens(): Promise<VenusToken[]> {
        // TODO [#8]: return all of supported borrow tokens
        return [];
    }
}