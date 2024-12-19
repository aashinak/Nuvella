import IProduct from "../../entities/product/IProduct";
import Product from "../../models/product/productModel";
import ApiError from "../../utils/apiError";
import logger from "../../utils/logger";
import { Types } from "mongoose";

class ProductRepository {
  // Create a new product
  async createProduct(productData: Partial<IProduct>): Promise<IProduct> {
    try {
      const product = new Product(productData);
      return await product.save();
    } catch (error: any) {
      logger.error(`Error creating product: ${error.message}`, error);
      throw new ApiError(500, "Internal Server Error while creating product", [
        error.message,
      ]);
    }
  }

  // Find a product by ID
  async findById(productId: string): Promise<IProduct | null> {
    try {
      return await Product.findById(productId);
    } catch (error: any) {
      logger.error(`Error finding product by ID: ${productId}`, error);
      throw new ApiError(500, "Internal Server Error while finding product", [
        error.message,
      ]);
    }
  }

  // Update product by ID
  async updateProduct(
    productId: string,
    updatedData: Partial<IProduct>
  ): Promise<IProduct | null> {
    try {
      return await Product.findByIdAndUpdate(productId, updatedData, {
        new: true,
      });
    } catch (error: any) {
      logger.error(`Error updating product by ID: ${productId}`, error);
      throw new ApiError(500, "Internal Server Error while updating product", [
        error.message,
      ]);
    }
  }

  // Delete a product by ID
  async deleteProduct(productId: string): Promise<IProduct | null> {
    try {
      return await Product.findByIdAndDelete(productId);
    } catch (error: any) {
      logger.error(`Error deleting product by ID: ${productId}`, error);
      throw new ApiError(500, "Internal Server Error while deleting product", [
        error.message,
      ]);
    }
  }

  // Decrease stock of a product and its specific size
  async decreaseStock(
    productId: string,
    size: string,
    quantity: number
  ): Promise<IProduct> {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new ApiError(404, "Product not found");
      }

      // Find the size-specific stock
      if(product.sizes){
        const sizeEntry = product.sizes.find((s) => s.size === size);
      if (!sizeEntry) {
        throw new ApiError(404, `Size '${size}' not found for product`);
      }

      // Check stock availability
      if (sizeEntry.stock < quantity) {
        throw new ApiError(400, `Insufficient stock for size '${size}'`);
      }

      // Update stock
      sizeEntry.stock -= quantity;
      }
      product.stock -= quantity;

      const updatedProduct = await product.save();
      logger.info(
        `Stock decreased: Product ${productId}, Size ${size}, Quantity ${quantity}`
      );
      return updatedProduct;
    } catch (error: any) {
      logger.error(
        `Error decreasing stock for product ${productId}: ${error.message}`,
        error
      );
      throw new ApiError(500, "Error while decreasing stock", [error.message]);
    }
  }

  // Increase stock of a product and its specific size
  async increaseStock(
    productId: string,
    size: string,
    quantity: number
  ): Promise<IProduct> {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new ApiError(404, "Product not found");
      }

      // Find the size-specific stock
      if(product.sizes){
        const sizeEntry = product.sizes.find((s) => s.size === size);
        if (!sizeEntry) {
          // If size doesn't exist, add it
          product.sizes.push({ size, stock: quantity });
        } else {
          // Update stock
          sizeEntry.stock += quantity;
        }
      }
     

      // Update overall stock
      product.stock += quantity;

      const updatedProduct = await product.save();
      logger.info(
        `Stock increased: Product ${productId}, Size ${size}, Quantity ${quantity}`
      );
      return updatedProduct;
    } catch (error: any) {
      logger.error(
        `Error increasing stock for product ${productId}: ${error.message}`,
        error
      );
      throw new ApiError(500, "Error while increasing stock", [error.message]);
    }
  }

  // Delete all products under a specific category
  async deleteProductsByCategory(categoryId: string): Promise<number> {
    try {
      const result = await Product.deleteMany({
        categoryId,
      });
      const deletedCount = result.deletedCount || 0; // Ensure deletedCount is always a number.
      logger.info(
        `${deletedCount} products deleted for category ID: ${categoryId}`
      );

      return deletedCount;
    } catch (error: any) {
      logger.error(
        `Error deleting products for category ID: ${categoryId}`,
        error
      );
      throw new ApiError(500, "Error while deleting products by category", [
        error.message,
      ]);
    }
  }

  // Find all products
  async findAll(): Promise<IProduct[]> {
    try {
      return await Product.find();
    } catch (error: any) {
      logger.error("Error finding all products", error);
      throw new ApiError(500, "Internal Server Error while finding products", [
        error.message,
      ]);
    }
  }

  async findProductsByCategory(categoryId: string): Promise<IProduct[]> {
    try {
      const products = await Product.find({ categoryId }).populate("categoryId").populate("discountId");
      return products;
    } catch (error: any) {
      logger.error(
        `Error finding products for category ID: ${categoryId}`,
        error
      );
      throw new ApiError(500, "Error while finding products by category", [
        error.message,
      ]);
    }
  }
}

export default new ProductRepository();
