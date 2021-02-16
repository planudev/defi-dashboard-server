import { DataSource } from 'apollo-datasource';
import { InMemoryLRUCache, PrefixingKeyValueCache } from 'apollo-server-caching';
import crToken from '../abis/crToken.json';
import IBEP20 from '../abis/IBEP20.json';
import creamMainnetConfig from '../config/cream-mainnet.json';
import { ethers, BigNumber } from "ethers";
import { CreamToken } from "../generated.types";
import * as O from 'fp-ts/Option';
import { map } from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import has from 'lodash/fp/has';
import prop from 'lodash/fp/prop';
import compose from 'lodash/fp/compose';
import curry from 'lodash/fp/curry';

type CreamTokenCache = {
    contract: ethers.Contract;
    name?: string;
    symbol?: string;
    decimals?: number;
    underlyingAddress?: string;
}

const safeProp = curry((p: string, obj: Record<string, any>) => compose(O.of, prop(p))(obj));

class CreamFinanceAPI extends DataSource {
    private provider: ethers.providers.JsonRpcProvider;
    private creamTokenContracts: ethers.Contract[];
    private cache: Record<string, CreamTokenCache>;

    constructor() {
        super();
        this.provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
        this.cache = {};
        this.creamTokenContracts = Object.values(creamMainnetConfig.tokenAddress).map((address: string) => {
            const contract = new ethers.Contract(address, crToken, this.provider);
            this.cache[address] = {
                contract
            };
            return contract;
        });
    }

    private calculateAPY(ratePerBlock: number): number {
        const ethMantissa = 1e18;
        const blocksPerDay = 20 * 60 * 24;
        const daysPerYear = 365;

        // const apy = (ratePerBlockBigNumber.mul(ethMantissa).div(blocksPerDay)).add(1).pow(daysPerYear).sub(1).mul(100);
        const apy = (((Math.pow((ratePerBlock / ethMantissa * blocksPerDay) + 1, daysPerYear))) - 1) * 100;

        return apy;
    }

    public async getName(contractAddress: string): Promise<string> {
        const creamTokenCache = this.cache[contractAddress];
        if (creamTokenCache == undefined) {
            return '';
        }

        if (creamTokenCache.name != undefined) {
            return creamTokenCache.name;
        }

        const name = await creamTokenCache.contract.name();
        creamTokenCache.name = name;

        return name;
    }

    public async getSymbol(contractAddress: string): Promise<string> {
        const creamTokenCache = this.cache[contractAddress];
        if (creamTokenCache == undefined) {
            return '';
        }

        if (creamTokenCache.symbol != undefined) {
            return creamTokenCache.symbol;
        }

        const symbol = await creamTokenCache.contract.symbol();
        creamTokenCache.symbol = symbol;
        
        return symbol;
    }

    public async getDecimals(contractAddress: string): Promise<number> {
        const key = 'decimals';
        const optionCreamTokenCache: O.Option<CreamTokenCache> = safeProp(contractAddress)(this.cache);
        if (O.isNone(optionCreamTokenCache)) {
            return 0;
        }

        const optionDecimals: O.Option<number> = pipe(
            optionCreamTokenCache,
            O.chain<CreamTokenCache, number>(safeProp(key)),
            O.chain(O.fromNullable) 
        );
        
        if (O.isSome(optionDecimals)) {
            return optionDecimals.value;
        }

        this.cache[contractAddress].decimals = await optionCreamTokenCache.value.contract.decimals();
        return this.cache[contractAddress].decimals ?? 0;
    }

    public async getUnderlyingAddress(contractAddress: string): Promise<string | null> {
        const creamTokenCache = this.cache[contractAddress];
        if (creamTokenCache == undefined) {
            return null;
        }

        if (creamTokenCache.underlyingAddress != undefined) {
            return creamTokenCache.underlyingAddress;
        }
        
        const underlyingAddress = await creamTokenCache.contract.underlying();
        if (underlyingAddress == undefined) {
            return null;
        }

        creamTokenCache.underlyingAddress = underlyingAddress;
        
        return underlyingAddress;
    }

    public async getUnderlyingName(contractAddress: string): Promise<string> {
        if (!this.cache[contractAddress]) {
            this.cache[contractAddress] = {
                contract: new ethers.Contract(contractAddress, crToken, this.provider),
            };
        }

        return this.getName(contractAddress);
    }

    public async getUnderlyingSymbol(contractAddress: string): Promise<string> {
        if (!this.cache[contractAddress]) {
            this.cache[contractAddress] = {
                contract: new ethers.Contract(contractAddress, crToken, this.provider),
            };
        }

        return this.getSymbol(contractAddress);
    }

    public async getSupportTokens(): Promise<CreamToken[]> {
        return await Promise.all(this.creamTokenContracts.map(async (contract, index) => {
            const symbol = await this.getSymbol(contract.address);
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
                underlyingAddress: await this.getUnderlyingAddress(contract.address),
            };
        }));
    }

    public async getSupplyRatePerBlock(contractAddress: string): Promise<number> {
        const optionCreamTokenCache: O.Option<CreamTokenCache> = safeProp(contractAddress)(this.cache);
        if (O.isNone(optionCreamTokenCache)) {
            return 0;
        }

        return await optionCreamTokenCache.value.contract.supplyRatePerBlock();
    }

    public async getBorrowRatePerBlock(contractAddress: string): Promise<number> {
        const optionCreamTokenCache: O.Option<CreamTokenCache> = safeProp(contractAddress)(this.cache);
        if (O.isNone(optionCreamTokenCache)) {
            return 0;
        }

        return await optionCreamTokenCache.value.contract.borrowRatePerBlock();
    }

    public getSupplyApy(supplyRatePerBlock: number): number {
        return this.calculateAPY(supplyRatePerBlock);
    }

    public getBorrowApy(borrowRatePerBlock: number): number {
        return this.calculateAPY(borrowRatePerBlock);
    }
}

export { CreamFinanceAPI };