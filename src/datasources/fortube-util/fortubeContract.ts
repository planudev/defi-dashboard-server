import Web3 from "web3";
import { getNetworkUri, fortubeConfigPath } from '../utils';
import { BSCNetwork, ForTubeContractType } from '../../types';


const fs = require('fs');


export class ForTubeContract {
    
    private abiPath: string = fortubeConfigPath + '/fortubeAbi.json';
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
        return this.createContract(ForTubeContractType.BANKCONTROLLER, contractAddress);
    }

    async createPriceOracleContract(contractAddress: string) {
        return this.createContract(ForTubeContractType.PRICEORACLE, contractAddress);
    }

    private async createContract(contractType: ForTubeContractType, contractAddress: string) {  
        return new this.web3.eth.Contract(this.getAbi(contractType), contractAddress);
    }

    private loadAbiConfig() {
        const content = fs.readFileSync(this.abiPath);
        return JSON.parse(content);
    }

    private getAbi(contractType: ForTubeContractType) {
        return this.abiConfig[contractType];
    }
}
