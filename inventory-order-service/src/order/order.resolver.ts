import { Resolver, Query, Mutation, Args, ID, Subscription } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './order.schema';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';

@Resolver(() => Order)
export class OrderResolver {
  constructor(
    private readonly orderService: OrderService,
    @Inject('PUB_SUB') private pubSub: any,
  ) {}

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

  @Mutation(() => Order)
  async updateOrderStatus(
    @Args('orderId', { type: () => ID }) orderId: string,
    @Args('status') status: string,
  ): Promise<Order> {
    const updatedOrder = await this.orderService.updateStatus(orderId, status);
    if (!updatedOrder) {
      throw new Error('Order not found');
    }
    this.pubSub.publish('orderStatusUpdated', { orderStatusUpdated: updatedOrder });
    return updatedOrder;
  }

  @Subscription(() => Order, {
    name: 'orderStatusUpdated',
    filter: (payload, variables) =>
      payload.orderStatusUpdated.customerId === variables.customerId,
  })
  orderStatusUpdated(@Args('customerId', { type: () => ID }) customerId: string) {
    return this.pubSub.asyncIterator('orderStatusUpdated');
  }
} 