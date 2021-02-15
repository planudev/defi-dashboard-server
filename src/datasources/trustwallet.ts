import { RESTDataSource } from 'apollo-datasource-rest';


type TrustWalletTokenLists = {
    name: string;
    logoURI: string;
    timestamp: string;
    tokens: TrustWalletToken[];
};

type TrustWalletToken = {
    chainId: number;
    asset: string;
    type: string;
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    logoURI: string;
    pairs: any[];
};

class TrustWalletAPI extends RESTDataSource {
    private cacheMappedTokens: Record<string, TrustWalletToken>;
    private updatedAt: number;
    private gapBetweenEachUpdate: number;
    private getTokenRecordsPromise: Promise<Record<string, TrustWalletToken>> | undefined;
    
    constructor() {
        super();
        this.baseURL = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/'
        this.cacheMappedTokens = {};
        this.updatedAt = 0;
        this.gapBetweenEachUpdate = 900;   
    }

    public async getLogoURI(symbol: string): Promise<string> {
        if (this.isDataNeedRefresh())
            await this.refreshData();

        const token = this.cacheMappedTokens[symbol.toUpperCase()];
        if (token === undefined)
            return '';

        const contractAddress = token.address;
        return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/${contractAddress}/logo.png`;
    }

    private async getTokenRecords(): Promise<Record<string, TrustWalletToken>> {
        
        const data = await this.get('smartchain/tokenlist.json');   // ปัญหาอยู่บรรทัดนี่แหละ
        const trustWalletTokenLists: TrustWalletTokenLists = JSON.parse(data);

        const mappedTokens: Record<string, TrustWalletToken> = {};
        trustWalletTokenLists.tokens.forEach(token => {
            mappedTokens[token.symbol.toUpperCase()] = token;
        });

        if (this.getTokenRecordsPromise != undefined) {
            this.getTokenRecordsPromise = Promise.resolve(mappedTokens);
            this.getTokenRecordsPromise = undefined;
        }

        return mappedTokens;
    }

    private async refreshData(): Promise<void> {
        if (this.getTokenRecordsPromise == undefined) {
            this.getTokenRecordsPromise = this.getTokenRecords();
        }

        this.cacheMappedTokens = await this.getTokenRecordsPromise;
        this.updatedAt = Date.now();
    }

    private isDataNeedRefresh(): boolean {
        return Date.now() - this.updatedAt >= this.gapBetweenEachUpdate;
    }
}

export { TrustWalletAPI };