import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as amqp from 'amqplib';
import { ConsumeMessage } from 'amqplib';
import { OrderHistoryService } from './order-history/order-history.service';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private readonly url = 'amqp://localhost';
  private readonly queue = 'order_created';
  private connection: any;
  private channel: any;
  private readonly logger = new Logger(RabbitMQService.name);

  constructor(private readonly orderHistoryService: OrderHistoryService) {}

  async onModuleInit() {
    this.connection = await amqp.connect(this.url);
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(this.queue, { durable: true });

    this.channel.consume(this.queue, async (msg: ConsumeMessage | null) => {
      if (msg !== null) {
        const order = JSON.parse(msg.content.toString());
        this.logger.log(`Received order event: ${JSON.stringify(order)}`);
        this.logger.debug(`Order keys: ${Object.keys(order)}`);
        if (!order.customerId) {
          this.logger.error('customerId is missing in the received order event!', order);
        }
        // Map order fields to OrderHistory schema
        await this.orderHistoryService.create({
          customerId: order.customerId,
          productId: order.productId,
          quantity: order.quantity,
          status: order.status,
        });
        this.channel.ack(msg);
      }
    });
  }
} 