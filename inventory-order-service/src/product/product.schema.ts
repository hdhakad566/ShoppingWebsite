import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ObjectType, ID, Float } from '@nestjs/graphql';

@Schema()
@ObjectType()
export class Product extends Document {
  @Field(() => ID)
  declare _id: string;

  @Prop({ required: true })
  @Field()
  name: string;

  @Prop({ required: true })
  @Field(() => Float)
  price: number;

  @Prop({ required: true })
  @Field(() => Number)
  quantity: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product); 