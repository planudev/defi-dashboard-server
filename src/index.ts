import { ApolloServer, gql } from 'apollo-server';
import { DataSources } from "apollo-server-core/dist/graphqlOptions";
import { Currency, Resolvers } from './generated.types';
import { bitQueryClient } from './apollo/client';
import { TRACKING_BALANCE } from './apollo/queries';
import { CoinGeckoAPI } from './datasources/coingecko';
import { TrustWalletAPI } from './datasources/trustwallet';

const typeDefs = gql`
    type Query {
        "Query to get user by address"
        user(id: ID!): User
    }

    "User is a someone who hold the wallet"
    type User {
        "User's wallet address"
        id: ID!
        balances: [Currency]
    }

    interface Token {
        "Token's address"
        id: ID!
        "Token's address"
        address: String!
        "Token's name e.g. Ethereum, Pancake"
        name: String!
        "Token's symbol e.g. ETH, BNB, CAKE"
        symbol: String!
        "Token's decimal"
        decimals: Int!
        "Token's logo"
        logoURI: String
    }

    "Currency is a token that user have with can be Native or ERC20"
    type Currency implements Token {
        "Currency's address"
        id: ID!
        "Currency's address"
        address: String!
        "Currency's name e.g. Ethereum, Pancake"
        name: String!
        "Currency's symbol e.g. ETH, BNB, CAKE"
        symbol: String!
        "Currency's decimal"
        decimals: Int!
        "Currency's price per token"
        price: String
        "Amount of token that user have"
        value: String!
        "Currency's type 'ERC20'"
        tokenType: String
        "Currency's logo"
        logoURI: String
    }

    type VenusToken implements Token {
        id: ID!
        address: String!
        name: String!
        symbol: String!
        decimals: Int!
        price: String!
        "Amount of token that user have"
        value: String!
        logoURI: String
        annualPercentageYield: String!
        isCollateral: Boolean!
    }

    type Venus {
        id: ID!
        supplyBalance: String!
        borrowBalance: String!
        vaiMintedAmount: String!
        suppliedTokens: [VenusToken]!
        borrowedTokens: [VenusToken]!
    }
`;

const resolvers: Resolvers = {
    Query: {
        // TODO [#2]: need to define type of Response query from bitquery.io
        // 
        // Raw response can be found in https://explorer.bitquery.io/graphql/Sr4ksApTAT
        // It should be define in types.ts
        user: async (parent, { id }) => {
            const { loading, error, data } = await bitQueryClient.query({
                query: TRACKING_BALANCE,
                variables: {
                    "limit":10,
                    "offset":0,
                    "network":"bsc",
                    "address": id
                }
            });

            return {
                id: id,
                balances: data.ethereum.address[0].balances.map((balance: any) => {
                    return {
                        id: balance.currency.address,
                        address: balance.currency.address,
                        name: balance.currency.name,
                        symbol: balance.currency.symbol,
                        decimals: balance.currency.decimals,
                        value: balance.value,
                    };
                }),
            };
        },
    },

    Token: {
        __resolveType(token, context, info) {
            return null;
        }
    },

    Currency: {
        price: async (parent: Currency, args, { dataSources }) => {
            return dataSources.coingeckoAPI.getPrice(parent.symbol);
        },
        
        logoURI: async (parent: Currency, args, { dataSources }) => {
            if (parent.symbol.toUpperCase() == 'BNB') {
                return 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png';
            }

            return dataSources.trustWalletAPI.getLogoURI(parent.symbol);
        }
    },
}

type IDataSources = {
    coingeckoAPI: CoinGeckoAPI;
    trustWalletAPI: TrustWalletAPI;
}

const dataSources: DataSources<IDataSources> = {
    coingeckoAPI: new CoinGeckoAPI(),
    trustWalletAPI: new TrustWalletAPI(),
}

const server = new ApolloServer({
    typeDefs, 
    resolvers,
    dataSources: () => dataSources,
    introspection: true,
    playground: true,
});

server.listen({ port: process.env.PORT || 4000 }).then(async () => {
    console.log(`
        🚀  Server is running!
        🔉  Listening on port 4000
        📭  Query at https://studio.apollographql.com/dev
    `);
});