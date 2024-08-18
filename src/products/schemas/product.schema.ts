import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @ApiProperty({ description: 'The name of the product' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ description: 'The description of the product' })
  @Prop({ required: true })
  description: string;

  @ApiProperty({ description: 'The price of the product' })
  @Prop({ required: true })
  price: number;

  @ApiProperty({ description: 'The quantity of the product in stock' })
  @Prop({ required: true, default: 0 })
  stockQuantity: number;

  @ApiProperty({ description: 'The category of the product' })
  @Prop()
  category: string;

  @ApiProperty({ description: 'Whether the product is on sale' })
  @Prop({ default: false })
  onSale: boolean;

  @ApiProperty({
    description: 'The sale price of the product',
    required: false,
  })
  @Prop()
  salePrice: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
