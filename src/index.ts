import { ApolloServer, MockList, gql } from 'apollo-server';
import { Resolvers } from './generated.types';
import { bitQueryClient } from './apollo/client';
import { TRACKING_BALANCE } from './apollo/queries';
import { getCoinsFromCoinGecko, getPriceByCoinGeckoId } from './coinGecko';

let coinIdByName: any = {};

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

    "Currency is a token that user have with can be Native or ERC20"
    type Currency {
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
        symbolUrl: String
    }
`;

// const mocks = {
//     User: () => ({
//         id: () => '0x13f15A0Cf049d75800D22DA32fEE09A2612F8Faf',
//         balances: () => new MockList([2, 6]),
//     }),

//     Currency: () => ({
//         id: () => '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
//         address: () => '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
//         name: () => 'Pancake',
//         symbol: () => 'CAKE',
//         price: () => '2.6',
//         value: () => '20.123131221',
//         symbolUrl: () => 'https://raw.githubusercontent.com/pancakeswap/pancake-frontend/develop/public/images/cake.svg'
//     }),
// }

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

    Currency: {
        price: async (parent) => {
            return await getPriceByCoinGeckoId(coinIdByName[parent.symbol.toLowerCase()]); 
        },
    },
}

const server = new ApolloServer({
    typeDefs, 
    resolvers,
    introspection: true,
    playground: true,
});

server.listen({ port: process.env.PORT || 4000 }).then(async () => {
    const coins = await getCoinsFromCoinGecko();

    coins.forEach(coin => {
        coinIdByName[coin.symbol] = coin.id;
    });

    console.log(`
        🚀  Server is running!
        🔉  Listening on port 4000
        📭  Query at https://studio.apollographql.com/dev
    `);
});