import ProductCategory from "../../models/product/productCategoryModel";
import IProductCategory from "../../entities/product/IProductCategory";
import logger from "../../utils/logger";
import ApiError from "../../utils/apiError";
import Product from "../../models/product/productModel";
import mongoose from "mongoose";

class ProductCategoryRepository {
  // Create a new product category
  async createProductCategory(
    categoryData: IProductCategory
  ): Promise<IProductCategory> {
    try {
      const productCategory = new ProductCategory(categoryData);
      return await productCategory.save();
    } catch (error: any) {
      logger.error("Error creating product category: ", error);
      throw new ApiError(500, "Failed to create product category", [
        error.message,
      ]);
    }
  }

  // Find all product categories
  async getAllProductCategories(): Promise<IProductCategory[]> {
    try {
      return await ProductCategory.find().select("name image");
    } catch (error: any) {
      logger.error("Error fetching product categories: ", error);
      throw new ApiError(500, "Failed to fetch product categories", [
        error.message,
      ]);
    }
  }

  // Find a product category by ID
  async getProductCategoryById(id: string): Promise<IProductCategory | null> {
    try {
      return await ProductCategory.findById(id);
    } catch (error: any) {
      logger.error(`Error finding product category by ID: ${id}`, error);
      throw new ApiError(500, "Failed to fetch product category by ID", [
        error.message,
      ]);
    }
  }

  // Find a product category by ID
  async getProductCategoryByName(
    name: string
  ): Promise<IProductCategory | null> {
    try {
      return await ProductCategory.findOne({ name });
    } catch (error: any) {
      logger.error(`Error finding product category by name: ${name}`, error);
      throw new ApiError(500, "Failed to fetch product category by ID", [
        error.message,
      ]);
    }
  }

  // Update a product category by ID
  async updateProductCategoryById(
    id: string,
    updateData: Partial<IProductCategory>
  ): Promise<IProductCategory | null> {
    try {
      return await ProductCategory.findByIdAndUpdate(id, updateData, {
        new: true, // Return the updated document
      });
    } catch (error: any) {
      logger.error(`Error updating product category by ID: ${id}`, error);
      throw new ApiError(500, "Failed to update product category", [
        error.message,
      ]);
    }
  }

  // Delete a product category by ID
  async deleteProductCategoryById(
    id: string
  ): Promise<IProductCategory | null> {
    try {
      return await ProductCategory.findByIdAndDelete(id);
    } catch (error: any) {
      logger.error(`Error deleting product category by ID: ${id}`, error);
      throw new ApiError(500, "Failed to delete product category", [
        error.message,
      ]);
    }
  }

  async deleteCategoryAndProducts(
    categoryId: string
  ): Promise<{ deletedCategory: boolean; deletedProducts: number }> {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      // Delete the category
      const categoryResult = await ProductCategory.findByIdAndDelete(
        categoryId,
        { session }
      );
      if (!categoryResult) {
        throw new ApiError(404, `Category with ID ${categoryId} not found`);
      }
      logger.info(`Category with ID ${categoryId} deleted.`);

      // Delete all products under this category
      const productResult = await Product.deleteMany(
        { categoryId },
        { session }
      );

      const deletedProductsCount = productResult.deletedCount || 0;
      logger.info(
        `${deletedProductsCount} products deleted for category ID: ${categoryId}`
      );

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      return { deletedCategory: true, deletedProducts: deletedProductsCount };
    } catch (error: any) {
      // Rollback the transaction in case of any error
      await session.abortTransaction();
      session.endSession();

      logger.error(
        `Error during deletion of category ID ${categoryId}: ${error.message}`
      );
      throw new ApiError(500, "Error during category and product deletion", [
        error.message,
      ]);
    }
  }
}

export default new ProductCategoryRepository();
