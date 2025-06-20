import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ObjectType, ID, Int } from '@nestjs/graphql';

@Schema({ timestamps: true })
@ObjectType()
export class Order extends Document {
  @Field(() => ID)
  declare _id: string;

  @Prop({ required: true })
  @Field()
  productId: string;

  @Prop({ required: true })
  @Field(() => Int)
  quantity: number;

  @Prop({ default: 'PENDING' })
  @Field()
  status: string;

  @Prop({ required: true })
  @Field()
  customerId: string;   // <--- ADD THIS LINE

  @Field()
  createdAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);