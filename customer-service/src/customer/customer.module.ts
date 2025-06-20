import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from './customer.schema';
import { CustomerService } from './customer.service';
import { CustomerResolver } from './customer.resolver';

@Module({
  imports: [MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema }])],
  providers: [CustomerService, CustomerResolver],
})
export class CustomerModule {} 