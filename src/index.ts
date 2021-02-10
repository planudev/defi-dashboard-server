import { ApolloServer } from 'apollo-server';
import { DataSources } from "apollo-server-core/dist/graphqlOptions";
import { CoinGeckoAPI } from './datasources/coingecko';
import { TrustWalletAPI } from './datasources/trustwallet';
import { VenusAPI } from './datasources/venus';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

type IDataSources = {
    coingeckoAPI: CoinGeckoAPI;
    trustWalletAPI: TrustWalletAPI;
    venusAPI: VenusAPI;
}

const dataSources: DataSources<IDataSources> = {
    coingeckoAPI: new CoinGeckoAPI(),
    trustWalletAPI: new TrustWalletAPI(),
    venusAPI: new VenusAPI(),
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