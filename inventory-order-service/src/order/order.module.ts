import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './order.schema';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { RabbitMQService } from '../rabbitmq.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }])],
  providers: [OrderService, OrderResolver, RabbitMQService],
})
export class OrderModule {} 