import fetch from 'cross-fetch';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

export const bitQueryClient = new ApolloClient({
    link: new HttpLink({ uri: 'https://graphql.bitquery.io', fetch }),
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    ethereum: {
                        merge: true,
                    }
                }
            }
        }
    }),
});
    