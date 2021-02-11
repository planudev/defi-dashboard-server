import type { LendingAnnualPercentageYield } from '../types';
import crToken from '../abis/crToken.json';
import creamMainnetConfig from '../config/cream-mainnet.json';

class CreamFinanceAPI {
    private async calculateAPY(): Promise<LendingAnnualPercentageYield> {
        const ethMantissa = 1e18;
        const blocksPerDay = 20 * 60 * 24;
        const daysPerYear = 365;

        const supplyRatePerBlock = await this.getSupplyRatePerBlock(); 
        const borrowRatePerBlock = await this.getBorrowRatePerBlock();
        const supplyApy = (((Math.pow((supplyRatePerBlock / ethMantissa * blocksPerDay) + 1, daysPerYear))) - 1) * 100;
        const borrowApy = (((Math.pow((borrowRatePerBlock / ethMantissa * blocksPerDay) + 1, daysPerYear))) - 1) * 100;

        return {
            supplyApy,
            borrowApy
        };
    }

    private async getSupplyRatePerBlock(): Promise<number> {
        // TODO: Get SupplyRatePerBlock using the crToken contract
        return 0;
    }

    private async getBorrowRatePerBlock(): Promise<number> {
        // TODO: Get BorrowRatePerBlock using the crToken contract
        return 0;
    }
}
