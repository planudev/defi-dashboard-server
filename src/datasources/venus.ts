import { DataSource } from 'apollo-datasource';
import { VenusToken } from '../generated.types';

class VenusAPI<TContext = any> extends DataSource {
    constructor() {
        super();
    }

    async getTotalSupplyBalance(address: string): Promise<string> {
        // TODO [$602383e0d6b71309a5721587]: return supply balance from venus by account
        return '';
    }

    async getTotalBorrowBalance(address: string): Promise<string> {
        // TODO [$602383e0d6b71309a5721588]: return borrow balance from venus by account
        return '';
    }

    async getSuppliedTokens(address: string): Promise<VenusToken[]> {
        // TODO [$602383e0d6b71309a5721589]: return all of supplied tokens by address
        return [];
    }

    async getBorrowedTokens(address: string): Promise<VenusToken[]> {
        // TODO [$602383e0d6b71309a572158a]: return all of borrowed tokens by address
        return [];
    }

    async getSupportSupplyTokens(): Promise<VenusToken[]> {
        // TODO [$602383e0d6b71309a572158b]: return all of supported supply tokens
        return [];
    }

    async getSupportBorrowTokens(): Promise<VenusToken[]> {
        // TODO [$602383e0d6b71309a572158c]: return all of supported borrow tokens
        return [];
    }
}