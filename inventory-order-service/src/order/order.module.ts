import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './order.schema';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { PubSubModule } from '../pubsub.module';
import { RabbitMQService } from '../rabbitmq.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    PubSubModule,
  ],
  providers: [OrderService, OrderResolver, RabbitMQService],
  exports: [OrderService],
})
export class OrderModule {} 