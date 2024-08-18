import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

import { ProductsService } from './products.service';
import { Product } from './schemas/product.schema';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'Return all products.',
    type: [Product],
  })
  findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get('on-sale')
  @ApiOperation({ summary: 'Get all products on sale' })
  @ApiResponse({
    status: 200,
    description: 'Return all products on sale.',
    type: [Product],
  })
  findOnSale(): Promise<Product[]> {
    return this.productsService.findOnSaleProducts();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by id' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'Return a product.', type: Product })
  findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: Product })
  @ApiResponse({
    status: 201,
    description: 'The product has been successfully created.',
    type: Product,
  })
  create(@Body() product: Partial<Product>): Promise<Product> {
    return this.productsService.create(product);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiBody({ type: Product })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully updated.',
    type: Product,
  })
  update(
    @Param('id') id: string,
    @Body() product: Partial<Product>,
  ): Promise<Product> {
    return this.productsService.update(id, product);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully deleted.',
    type: Product,
  })
  remove(@Param('id') id: string): Promise<Product> {
    return this.productsService.remove(id);
  }

  @Patch(':id/stock')
  @ApiOperation({ summary: 'Update product stock' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiBody({ schema: { properties: { quantity: { type: 'number' } } } })
  @ApiResponse({
    status: 200,
    description: 'The product stock has been successfully updated.',
    type: Product,
  })
  updateStock(
    @Param('id') id: string,
    @Body('quantity') quantity: number,
  ): Promise<Product> {
    return this.productsService.updateStock(id, quantity);
  }
}
