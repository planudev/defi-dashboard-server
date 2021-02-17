import { VenusToken } from '../generated.types';
import { BSCNetwork, BSCNetworkUri } from '../types';


export const selectedNetwork: BSCNetwork = BSCNetwork.Mainnet;

export const getNetworkUri = (network: BSCNetwork): BSCNetworkUri => {
    return network == BSCNetwork.Mainnet ? BSCNetworkUri.Mainnet : BSCNetworkUri.Testnet;
};


// const datasourcePath: string = './src/datasources';
const datasourcePath: string = '.';
export const venusConfigPath: string = datasourcePath + '/venus-util/config';
export const fortubeConfigPath: string = datasourcePath + '/fortube-util/config';


export enum ForTubeMainnetAddress {
    BANK_CONTROLLER = '0xc78248D676DeBB4597e88071D3d889eCA70E5469',
    PRICE_ORACLE = '0x19d76F29ca659bcFe95056A4b03885CC1439B257',
}


export enum VenusMainnetAddress {
    COMPTROLLER = '0xfD36E2c2a6789Db23113685031d7F16329158384',
    PRICE_ORACLE = '0x516c18DC440f107f12619a6d2cc320622807d0eE',
    VAI = '0x4BD17003473389A42DAF6a0a729f6Fdb328BbBd7',
}


export type VenusTokensResponse = {
    status: boolean;
    data: VenusTokensResponseData;
}


type VenusTokensResponseData = {
    markets: VenusToken[];
}


// InterestRateModel: 0xb932d9f1641C0f8181117944FB8Ac3e41c837fdC
// Msign: 0xdC30dA5Aaa5F48c71156353235Aa4D730263dD31

// Someone: 0xcD4d1e640E449662Fd29c0A683a50b50D717929b
// Another: 0x00ad504D2C02E0DDbf660bc35926712d0F0feA9e


// RewardPool Proxy: 0xD57f6b7A1027C2dD3E628653784455172f765671
// -> RewardPool: 0xa705d5be9ddce41b084fda5d52c0eaa8db8ffe4d
// -> Underlying [The Force Token]: 0x658A109C5900BC6d2357c87549B651670E5b0539

// Bank Proxy: 0x0cEA0832e9cdBb5D476040D58Ea07ecfbeBB7672
// -> Bank: 0x4Ac2735652944FE5C3dD95807287643502e5dE51
// -> BankController (Proxy): 0xc78248D676DeBB4597e88071D3d889eCA70E5469

// some tx: https://bscscan.com/tx/0xb3a418e24a986df6a75ed84859af2fa3c5b3eb122c17da32f4e1974a5239e2a5
