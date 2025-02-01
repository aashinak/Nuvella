import IProduct from "../../entities/product/IProduct";
import Product from "../../models/product/productModel";
import ApiError from "../../utils/apiError";
import logger from "../../utils/logger";
import mongoose, { Types } from "mongoose";

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
      return await Product.findById(productId)
        .populate("categoryId")
        .populate("discountId");
    } catch (error: any) {
      logger.error(`Error finding product by ID: ${productId}`, error);
      throw new ApiError(500, "Internal Server Error while finding product", [
        error.message,
      ]);
    }
  }

  async findByIds(ids: string[]): Promise<IProduct[]> {
    try {
      const objectIds = ids.map((id) => new mongoose.Types.ObjectId(id));

      return await Product.find({ _id: { $in: objectIds } })
        .populate("categoryId")
        .populate("discountId");
    } catch (error: any) {
      logger.error(`Error finding products by IDs: ${ids}`, {
        error: error.stack,
      });
      throw new ApiError(500, "Internal Server Error while finding products", [
        error.message,
      ]);
    }
  }

  async findProductNames({
    categoryId,
    searchKey,
  }: {
    categoryId?: string;
    searchKey: string;
  }): Promise<string[] | null> {
    try {
      const query: any = {
        name: { $regex: searchKey, $options: "i" }, // Case-insensitive search by name
      };

      if (categoryId) {
        query.categoryId = categoryId; // Add category filter if provided
      }

      // Use .select to fetch only the 'name' field
      const products = await Product.find(query).select("name");
      return products.map((product) => product.name); // Extract names
    } catch (error: any) {
      logger.error("Error finding product names", {
        categoryId,
        searchKey,
        error,
      });
      throw new ApiError(
        500,
        "Internal Server Error while finding product names",
        [error.message]
      );
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
      if (product.sizes) {
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
      if (product.sizes) {
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
      const products = await Product.find({ categoryId })
        .populate("categoryId")
        .populate("discountId");
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

  async findProductsByCategoryLimited(
    categoryId: string,
    pageIndex: number
  ): Promise<IProduct[]> {
    try {
      const pageSize = 20; // Fixed size of 20 products per page
      const skipCount = (pageIndex - 1) * pageSize; // Calculate the number of products to skip

      const products = await Product.find({ categoryId })
        .populate("categoryId")
        .populate("discountId")
        .skip(skipCount) // Skip products based on the page index
        .limit(pageSize); // Limit to 20 products per page

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

  async sortByRecentlyAdded(): Promise<IProduct[]> {
    try {
      return await Product.find()
        .sort({ createdAt: -1 }) // Sort by 'createdAt' in descending order
        .limit(8) // Limit to 8 products
        .populate("categoryId") // Populate the categoryId field
        .populate("discountId"); // Populate the discountId field
    } catch (error: any) {
      logger.error("Error finding all products", error);
      throw new ApiError(500, "Internal Server Error while finding products", [
        error.message,
      ]);
    }
  }

  async findMostDiscountedProducts(limit: number = 5) {
    try {
      const products = await Product.aggregate([
        {
          $lookup: {
            from: "productdiscounts", // The name of the ProductDiscount collection
            localField: "discountId", // The field in Product that references ProductDiscount
            foreignField: "_id", // The field in ProductDiscount that matches the reference
            as: "discountInfo", // Alias for the joined data
          },
        },
        {
          $unwind: "$discountInfo", // Unwind the discountInfo array (since it's a single object)
        },
        {
          $match: {
            "discountInfo.active": true, // Only consider active discounts
          },
        },
        {
          $sort: {
            "discountInfo.discount_percentage": -1, // Sort by discount percentage in descending order
          },
        },
        {
          $limit: limit, // Limit the number of results (e.g., top 5 products with the most discount)
        },
        {
          $project: {
            name: 1,
            price: 1,
            "discountInfo.name": 1,
            "discountInfo.discount_percentage": 1,
            "discountInfo.active": 1,
            images: 1,
          }, // Select the fields to return
        },
      ]);

      return products;
    } catch (error: any) {
      logger.error("Error finding all products", error);
      throw new ApiError(500, "Internal Server Error while finding products", [
        error.message,
      ]);
    }
  }
}

export default new ProductRepository();
