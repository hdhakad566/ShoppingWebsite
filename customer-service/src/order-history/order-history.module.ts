import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderHistory, OrderHistorySchema } from './order-history.schema';
import { OrderHistoryService } from './order-history.service';
import { OrderHistoryResolver } from './order-history.resolver';
import { RabbitMQService } from '../rabbitmq.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: OrderHistory.name, schema: OrderHistorySchema }])],
  providers: [OrderHistoryService, OrderHistoryResolver, RabbitMQService],
})
export class OrderHistoryModule {} 