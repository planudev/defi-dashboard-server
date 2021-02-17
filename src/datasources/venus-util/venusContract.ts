import Web3 from "web3";
import { BSCNetwork, VenusContractType } from '../../types';
import { getNetworkUri, venusConfigPath } from '../utils';


const fs = require('fs');


export class VenusContract {
    
    private abiPath: string = venusConfigPath + '/venusAbi.json';
    private web3: any;
    private abiConfig: any;

    constructor(selectedNetwork: BSCNetwork) {
        this.web3 = new Web3(new Web3.providers.HttpProvider(getNetworkUri(selectedNetwork)));
        this.abiConfig = this.loadAbiConfig();
    }

    async createVenusContract(contractAddress: string) {
        return this.createContract(VenusContractType.VENUS, contractAddress);
    }
    
    async createUnderlyingContract(contractAddress: string) {
        return this.createContract(VenusContractType.UNDERLYING, contractAddress);
    }

    async createComptrollerContract(contractAddress: string) {
        return this.createContract(VenusContractType.COMPTROLLER, contractAddress);
    }

    async createPriceOracleContract(contractAddress: string) {
        return this.createContract(VenusContractType.PRICEORACLE, contractAddress);
    }

    async createVAIContract(contractAddress: string) {
        return this.createContract(VenusContractType.VAI, contractAddress);
    }

    private async createContract(contractType: VenusContractType, contractAddress: string) {  
        return new this.web3.eth.Contract(this.getAbi(contractType), contractAddress);
    }

    private loadAbiConfig() {
        const content = fs.readFileSync(this.abiPath);
        return JSON.parse(content);
    }

    private getAbi(contractType: VenusContractType) {
        return this.abiConfig[contractType];
    }
}
