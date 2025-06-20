import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from './order.schema';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Query(() => [Order], { name: 'orders' })
  findAll() {
    return this.orderService.findAll();
  }

  @Query(() => Order, { name: 'order' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.orderService.findOne(id);
  }

  @Mutation(() => Order)
  createOrder(@Args('createOrderInput') createOrderInput: CreateOrderInput) {
    return this.orderService.create(createOrderInput);
  }

  @Mutation(() => Order)
  updateOrder(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateOrderInput') updateOrderInput: UpdateOrderInput,
  ) {
    return this.orderService.update(id, updateOrderInput);
  }

  @Mutation(() => Order)
  removeOrder(@Args('id', { type: () => ID }) id: string) {
    return this.orderService.remove(id);
  }
} 