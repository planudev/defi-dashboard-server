import { DataSource } from 'apollo-datasource';
import { InMemoryLRUCache, PrefixingKeyValueCache } from 'apollo-server-caching';
import crToken from '../abis/crToken.json';
import IBEP20 from '../abis/IBEP20.json';
import creamMainnetConfig from '../config/cream-mainnet.json';
import { ethers } from "ethers";
import { CreamToken } from "../generated.types";


class CreamFinanceAPI extends DataSource {
    private provider: ethers.providers.JsonRpcProvider;
    private creamTokenContracts: ethers.Contract[];
    private contractCache: Record<string, ethers.Contract>;
    private cache: PrefixingKeyValueCache;

    constructor() {
        super();
        this.provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
        this.contractCache = {};
        this.creamTokenContracts = Object.values(creamMainnetConfig.tokenAddress).map((address: string) => {
            const contract = new ethers.Contract(address, crToken, this.provider);
            this.contractCache[address] = contract;
            return contract;
        });
        const inner = new InMemoryLRUCache();
        this.cache = new PrefixingKeyValueCache(inner, '');
    }

    private calculateAPY(ratePerBlock: number): number {
        const ethMantissa = 1e18;
        const blocksPerDay = 20 * 60 * 24;
        const daysPerYear = 365;

        const apy = (((Math.pow((ratePerBlock / ethMantissa * blocksPerDay) + 1, daysPerYear))) - 1) * 100;

        return apy;
    }

    // private async getByKeyIfUndefiendSet(cache: PrefixingKeyValueCache, key: string, getter: 

    public async getName(contractAddress: string): Promise<string> {
        const nameFromCache = await this.cache.get(`${contractAddress}.name`);
        if (nameFromCache != undefined) {
            return nameFromCache;
        }

        const name = await this.contractCache[contractAddress].name();
        this.cache.set(`${contractAddress}.name`, name);
        return name;
    }

    public async getSupportTokens(): Promise<CreamToken[]> {
        return await Promise.all(this.creamTokenContracts.map(async (contract, index) => {
            const symbol = await contract.symbol();
            if (symbol == 'crBNB') {
                return {
                    address: contract.address,
                    symbol: symbol,
                    underlyingAddress: null,
                };
            }

            return { 
                address: contract.address,
                symbol: symbol,
                underlyingAddress: await contract.underlying(),
            };
        }));
    }

    public getSupplyApy(supplyRatePerBlock: number): number {
        return this.calculateAPY(supplyRatePerBlock);
    }

    public getBorrowApy(borrowRatePerBlock: number): number {
        return this.calculateAPY(borrowRatePerBlock);
    }
}

export { CreamFinanceAPI };