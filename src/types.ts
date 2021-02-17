export enum BSCNetwork {
    Mainnet = 'mainnet',
    Testnet = 'testnet',
};

export enum BSCNetworkUri {
    Mainnet = 'https://bsc-dataseed4.ninicoin.io:443',
    Testnet = 'https://data-seed-prebsc-1-s1.binance.org:8545',
}

export enum VenusContractType {
    VENUS = 'venus',
    UNDERLYING = 'underlying',
    COMPTROLLER = 'Comptroller',
    PRICEORACLE = 'PriceOracle',
    VAI = 'VAI',
}

export enum ForTubeContractType {
    FToken = 'FToken',
    UNDERLYING = 'Underlying',
    // BANK = 'Bank',
    BANKCONTROLLER = 'BankController',
    PRICEORACLE = 'PriceOracle',
}
