import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { OrderHistoryService } from './order-history.service';
import { OrderHistory } from './order-history.schema';
import { CreateOrderHistoryInput } from './dto/create-order-history.input';
import { UpdateOrderHistoryInput } from './dto/update-order-history.input';

@Resolver(() => OrderHistory)
export class OrderHistoryResolver {
  constructor(private readonly orderHistoryService: OrderHistoryService) {}

  @Query(() => [OrderHistory], { name: 'orderHistories' })
  findAll() {
    return this.orderHistoryService.findAll();
  }

  @Query(() => OrderHistory, { name: 'orderHistory' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.orderHistoryService.findOne(id);
  }

  @Mutation(() => OrderHistory)
  createOrderHistory(@Args('createOrderHistoryInput') createOrderHistoryInput: CreateOrderHistoryInput) {
    return this.orderHistoryService.create(createOrderHistoryInput);
  }

  @Mutation(() => OrderHistory)
  updateOrderHistory(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateOrderHistoryInput') updateOrderHistoryInput: UpdateOrderHistoryInput,
  ) {
    return this.orderHistoryService.update(id, updateOrderHistoryInput);
  }

  @Mutation(() => OrderHistory)
  removeOrderHistory(@Args('id', { type: () => ID }) id: string) {
    return this.orderHistoryService.remove(id);
  }
} 