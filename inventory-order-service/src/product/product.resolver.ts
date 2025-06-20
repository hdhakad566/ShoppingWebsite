import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './product.schema';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => [Product], { name: 'products' })
  findAll() {
    return this.productService.findAll();
  }

  @Query(() => Product, { name: 'product' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.productService.findOne(id);
  }

  @Mutation(() => Product)
  createProduct(@Args('createProductInput') createProductInput: CreateProductInput) {
    return this.productService.create(createProductInput);
  }

  @Mutation(() => Product)
  updateProduct(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ) {
    return this.productService.update(id, updateProductInput);
  }

  @Mutation(() => Product)
  removeProduct(@Args('id', { type: () => ID }) id: string) {
    return this.productService.remove(id);
  }
} 