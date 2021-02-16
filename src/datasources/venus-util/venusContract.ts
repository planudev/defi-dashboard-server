import Web3 from "web3";
import { BSCNetwork, ContractType } from '../../types';
import { getNetworkUri } from './utils';
import venusAbi from './config/venusAbi.json';


const fs = require('fs');


export class VenusContract {
    private web3: any;
    private abiConfig: any;

    constructor(selectedNetwork: BSCNetwork) {
        this.web3 = new Web3(new Web3.providers.HttpProvider(getNetworkUri(selectedNetwork)));
        this.abiConfig = this.loadAbiConfig();
    }

    async createVenusContract(contractAddress: string) {
        return this.createContract(ContractType.VENUS, contractAddress);
    }
    
    async createUnderlyingContract(contractAddress: string) {
        return this.createContract(ContractType.UNDERLYING, contractAddress);
    }

    async createComptrollerContract(contractAddress: string) {
        return this.createContract(ContractType.COMPTROLLER, contractAddress);
    }

    async createPriceOracleContract(contractAddress: string) {
        return this.createContract(ContractType.PRICEORACLE, contractAddress);
    }

    async createVAIContract(contractAddress: string) {
        return this.createContract(ContractType.VAI, contractAddress);
    }

    private async createContract(contractType: ContractType, contractAddress: string) {  
        return new this.web3.eth.Contract(this.getAbi(contractType), contractAddress);
    }

    private loadAbiConfig() {
        return venusAbi;
    }

    private getAbi(contractType: ContractType) {
        return this.abiConfig[contractType];
    }
}
