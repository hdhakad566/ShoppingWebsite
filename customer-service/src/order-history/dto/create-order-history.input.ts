import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateOrderHistoryInput {
  @Field()
  customerId: string;

  @Field()
  productId: string;

  @Field(() => Int)
  quantity: number;

  @Field({ defaultValue: 'PENDING' })
  status: string;
} 