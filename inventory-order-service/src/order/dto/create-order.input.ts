import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateOrderInput {
  @Field()
  productId: string;

  @Field(() => Int)
  quantity: number;

  @Field()
  customerId: string;   // <--- ADD THIS LINE
}