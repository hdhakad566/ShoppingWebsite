import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ObjectType, ID, Int } from '@nestjs/graphql';

@Schema({ timestamps: true })
@ObjectType()
export class OrderHistory extends Document {
  @Field(() => ID)
  declare _id: string;

  @Prop({ required: true })
  @Field()
  customerId: string;

  @Prop({ required: true })
  @Field()
  productId: string;

  @Prop({ required: true })
  @Field(() => Int)
  quantity: number;

  @Prop({ default: 'PENDING' })
  @Field()
  status: string;

  @Prop()
  @Field({ nullable: true })
  orderId?: string;

  @Field()
  createdAt: Date;
}

export const OrderHistorySchema = SchemaFactory.createForClass(OrderHistory); 