import type { LendingAnnualPercentageYield } from '../types';
import { DataSource } from 'apollo-datasource';
import crToken from '../abis/crToken.json';
import IBEP20 from '../abis/IBEP20.json';
import creamMainnetConfig from '../config/cream-mainnet.json';
import { ethers } from "ethers";
import { CreamToken } from "../generated.types";

class CreamFinanceAPI extends DataSource {
    private provider: ethers.providers.JsonRpcProvider;
    private creamTokenContracts: ethers.Contract[];

    constructor() {
        super();
        this.provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
        this.creamTokenContracts = Object.values(creamMainnetConfig.tokenAddress).map((address: string) => {
            return new ethers.Contract(address, crToken, this.provider);
        });
    }

    private calculateAPY(ratePerBlock: number): number {
        const ethMantissa = 1e18;
        const blocksPerDay = 20 * 60 * 24;
        const daysPerYear = 365;

        const apy = (((Math.pow((ratePerBlock / ethMantissa * blocksPerDay) + 1, daysPerYear))) - 1) * 100;

        return apy;
    }

    public async getSupportTokens(): Promise<CreamToken[]> {
        return await Promise.all(this.creamTokenContracts.map(async (contract, index) => {
            const symbol = await contract.symbol();
            if (symbol == 'crBNB') {
                return {
                    address: contract.address,
                    name: await contract.name(),
                    symbol: symbol,
                    decimals: await contract.decimals(),
                    underlyingAddress: '-',
                    underlyingName: 'Binance Native Token',
                    underlyingSymbol: 'BNB',
                    supplyRatePerBlock: await contract.supplyRatePerBlock(),
                    borrowRatePerBlock: await contract.borrowRatePerBlock()
                };
            }

            const underlyingContract = new ethers.Contract(await contract.underlying(), IBEP20, this.provider);

            return {
                address: contract.address,
                name: await contract.name(),
                symbol: symbol,
                decimals: await contract.decimals(),
                underlyingAddress: await underlyingContract.address,
                underlyingName: await underlyingContract.name(),
                underlyingSymbol: await underlyingContract.symbol(),
                supplyRatePerBlock: await contract.supplyRatePerBlock(),
                borrowRatePerBlock: await contract.borrowRatePerBlock()
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