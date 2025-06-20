import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateCustomerInput {
  @Field()
  email: string;

  @Field()
  name: string;
} 