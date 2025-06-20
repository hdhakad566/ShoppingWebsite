import { Module, Global } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

// Create a PubSub instance
const pubSub = new PubSub();

@Global()
@Module({
  providers: [
    {
      provide: 'PUB_SUB',
      useValue: pubSub,
    },
  ],
  exports: ['PUB_SUB'],
})
export class PubSubModule {} 