import Web3 from "web3";
import { getNetworkUri } from '../utils';
import { BSCNetwork, ForTubeContractType } from '../../types';
import fortubeAbi from './config/fortubeAbi.json';

export class ForTubeContract {
    private web3: any;
    private abiConfig: any;

    constructor(selectedNetwork: BSCNetwork) {
        this.web3 = new Web3(new Web3.providers.HttpProvider(getNetworkUri(selectedNetwork)));
        this.abiConfig = this.loadAbiConfig();
    }

    async createFTokenContract(contractAddress: string) {
        return this.createContract(ForTubeContractType.FToken, contractAddress);
    }

    async createUnderlyingContract(contractAddress: string) {
        return this.createContract(ForTubeContractType.UNDERLYING, contractAddress);
    }

    async createBankControllerContract(contractAddress: string) {
        return this.createContract(ForTubeContractType.BANK_CONTROLLER, contractAddress);
    }

    async createPriceOracleContract(contractAddress: string) {
        return this.createContract(ForTubeContractType.PRICE_ORACLE, contractAddress);
    }

    private async createContract(contractType: ForTubeContractType, contractAddress: string) {  
        return new this.web3.eth.Contract(this.getAbi(contractType), contractAddress);
    }

    private loadAbiConfig() {
        return fortubeAbi;
    }

    private getAbi(contractType: ForTubeContractType) {
        return this.abiConfig[contractType];
    }
}
