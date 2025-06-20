import { GraphQLClient } from 'graphql-request';

const inventoryApiUrl = 'http://localhost:3000/graphql';
const customerApiUrl = 'http://localhost:3001/graphql';

export const inventoryClient = new GraphQLClient(inventoryApiUrl);
export const customerClient = new GraphQLClient(customerApiUrl); 