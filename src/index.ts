import { ApolloServer } from 'apollo-server';
import 'apollo-cache-control';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { context, dataSources } from './context';

const server = new ApolloServer({
    typeDefs, 
    resolvers,
    dataSources: (): any => dataSources,
    context: () => context,
    tracing: true,
    playground: true
});

server.listen({ port: process.env.PORT || 4000 }).then(async () => {
    console.log(`
        🚀  Server is running!
        🔉  Listening on port 4000
        📭  Query at https://studio.apollographql.com/dev
    `);
});
