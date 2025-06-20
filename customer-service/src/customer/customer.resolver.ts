import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { CustomerService } from './customer.service';
import { Customer } from './customer.schema';
import { CreateCustomerInput } from './dto/create-customer.input';
import { UpdateCustomerInput } from './dto/update-customer.input';

@Resolver(() => Customer)
export class CustomerResolver {
  constructor(private readonly customerService: CustomerService) {}

  @Query(() => [Customer], { name: 'customers' })
  findAll() {
    return this.customerService.findAll();
  }

  @Query(() => Customer, { name: 'customer' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.customerService.findOne(id);
  }

  @Mutation(() => Customer)
  createCustomer(@Args('createCustomerInput') createCustomerInput: CreateCustomerInput) {
    return this.customerService.create(createCustomerInput);
  }

  @Mutation(() => Customer)
  updateCustomer(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateCustomerInput') updateCustomerInput: UpdateCustomerInput,
  ) {
    return this.customerService.update(id, updateCustomerInput);
  }

  @Mutation(() => Customer)
  removeCustomer(@Args('id', { type: () => ID }) id: string) {
    return this.customerService.remove(id);
  }
} 