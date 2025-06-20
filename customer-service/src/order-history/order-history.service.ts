import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderHistory } from './order-history.schema';
import { CreateOrderHistoryInput } from './dto/create-order-history.input';
import { UpdateOrderHistoryInput } from './dto/update-order-history.input';

@Injectable()
export class OrderHistoryService {
  constructor(@InjectModel(OrderHistory.name) private orderHistoryModel: Model<OrderHistory>) {}

  async create(createOrderHistoryInput: CreateOrderHistoryInput): Promise<OrderHistory> {
    return this.orderHistoryModel.create(createOrderHistoryInput);
  }

  async findAll(): Promise<OrderHistory[]> {
    return this.orderHistoryModel.find().exec();
  }

  async findOne(id: string): Promise<OrderHistory | null> {
    return this.orderHistoryModel.findById(id).exec();
  }

  async update(id: string, updateOrderHistoryInput: UpdateOrderHistoryInput): Promise<OrderHistory | null> {
    return this.orderHistoryModel.findByIdAndUpdate(id, updateOrderHistoryInput, { new: true }).exec();
  }

  async remove(id: string): Promise<OrderHistory | null> {
    return this.orderHistoryModel.findByIdAndDelete(id).exec();
  }
} 