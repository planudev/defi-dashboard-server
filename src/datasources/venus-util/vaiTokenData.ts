import { VenusContract } from './venusContract';
import { MainnetAddress } from './utils';


export class VAITokenData {
    
    private contractCreator: VenusContract;
    private VAIContract: any;

    constructor(contractCreator: VenusContract) {
        this.contractCreator = contractCreator;
        this.VAIContract = undefined;
    }

    async balanceOf(address: string): Promise<Number> {
        if (this.VAIContract === undefined)
            this.VAIContract = await this.createVAIContract();
        
        const balance = await this.VAIContract.methods.balanceOf(address).call();
        const decimals = await this.VAIContract.methods.decimals().call();
        return Number(balance) / 10 ** Number(decimals);
    }

    private async createVAIContract(): Promise<any> {
        return await this.contractCreator.createVAIContract(MainnetAddress.VAI);
    }
}
