import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async findOne(id: string): Promise<Product> {
    return this.productModel.findById(id).exec();
  }

  async create(product: Partial<Product>): Promise<Product> {
    const newProduct = new this.productModel(product);
    return newProduct.save();
  }

  async update(id: string, product: Partial<Product>): Promise<Product> {
    return this.productModel
      .findByIdAndUpdate(id, product, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Product> {
    return this.productModel.findByIdAndDelete(id).exec();
  }

  async findOnSaleProducts(): Promise<Product[]> {
    return this.productModel.find({ onSale: true }).exec();
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    return this.productModel
      .findByIdAndUpdate(
        id,
        { $inc: { stockQuantity: -quantity } },
        { new: true },
      )
      .exec();
  }
}
