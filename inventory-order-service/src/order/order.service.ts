import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './order.schema';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { RabbitMQService } from '../rabbitmq.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  async create(createOrderInput: CreateOrderInput): Promise<Order> {
    const order = await this.orderModel.create(createOrderInput);
    console.log('Created order:', order);
    // Publish event to RabbitMQ as a plain object
    await this.rabbitMQService.publishToQueue('order_created', order.toObject());
    return order;
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().exec();
  }

  async findOne(id: string): Promise<Order | null> {
    return this.orderModel.findById(id).exec();
  }

  async update(id: string, updateOrderInput: UpdateOrderInput): Promise<Order | null> {
    return this.orderModel.findByIdAndUpdate(id, updateOrderInput, { new: true }).exec();
  }

  async remove(id: string): Promise<Order | null> {
    return this.orderModel.findByIdAndDelete(id).exec();
  }
} 