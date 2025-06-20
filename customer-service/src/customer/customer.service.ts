import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer } from './customer.schema';
import { CreateCustomerInput } from './dto/create-customer.input';
import { UpdateCustomerInput } from './dto/update-customer.input';

@Injectable()
export class CustomerService {
  constructor(@InjectModel(Customer.name) private customerModel: Model<Customer>) {}

  async create(createCustomerInput: CreateCustomerInput): Promise<Customer> {
    return this.customerModel.create(createCustomerInput);
  }

  async findAll(): Promise<Customer[]> {
    return this.customerModel.find().exec();
  }

  async findOne(id: string): Promise<Customer | null> {
    return this.customerModel.findById(id).exec();
  }

  async update(id: string, updateCustomerInput: UpdateCustomerInput): Promise<Customer | null> {
    return this.customerModel.findByIdAndUpdate(id, updateCustomerInput, { new: true }).exec();
  }

  async remove(id: string): Promise<Customer | null> {
    return this.customerModel.findByIdAndDelete(id).exec();
  }
} 