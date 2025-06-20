import { GraphQLClient } from 'graphql-request';
import { createClient as createWSClient } from 'graphql-ws';
import { split, HttpLink, from } from '@apollo/client/core';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { ApolloClient, InMemoryCache } from '@apollo/client';

const httpUrl = 'http://localhost:3000/graphql';
const wsUrl = 'ws://localhost:3000/graphql';

const customerHttpUrl = 'http://localhost:3001/graphql';

// This is the simple client for the customer service, which doesn't need subscriptions yet.
export const customerClient = new GraphQLClient(customerHttpUrl);

// We need a more advanced Apollo Client for the inventory service to handle subscriptions.
const httpLink = new HttpLink({
  uri: httpUrl,
});

const wsLink = new GraphQLWsLink(
  createWSClient({
    url: wsUrl,
  }),
);

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

export const inventoryClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
}); 