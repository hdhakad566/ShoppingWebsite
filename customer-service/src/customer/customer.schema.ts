import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ObjectType, ID } from '@nestjs/graphql';

@Schema({ timestamps: true })
@ObjectType()
export class Customer extends Document {
  @Field(() => ID)
  declare _id: string;

  @Prop({ required: true, unique: true })
  @Field()
  email: string;

  @Prop({ required: true })
  @Field()
  name: string;

  @Field()
  createdAt: Date;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer); 