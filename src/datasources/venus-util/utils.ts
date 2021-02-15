import { VenusToken } from '../../generated.types';
import { BSCNetwork, BSCNetworkUri } from '../../types';
// import { fetch } from 'cross-fetch';


export enum MainnetAddress {
    COMPTROLLER = '0xfD36E2c2a6789Db23113685031d7F16329158384',
    PRICEORACLE = '0x516c18DC440f107f12619a6d2cc320622807d0eE',
    VAI = '0x4BD17003473389A42DAF6a0a729f6Fdb328BbBd7',
}

export type VenusTokensResponse = {
    status: boolean;
    data: VenusTokensResponseData;
}

export const selectedNetwork: BSCNetwork = BSCNetwork.Mainnet;

export const getNetworkUri = (network: BSCNetwork): BSCNetworkUri => {
    return network == BSCNetwork.Mainnet ? BSCNetworkUri.Mainnet : BSCNetworkUri.Testnet;
};

type VenusTokensResponseData = {
    markets: VenusToken[];
}