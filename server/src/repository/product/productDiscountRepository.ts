import ProductDiscount from "../../models/product/productDiscountModel";
import IProductDiscount from "../../entities/product/IProductDiscount";
import logger from "../../utils/logger";
import ApiError from "../../utils/apiError";

class ProductDiscountRepository {
  // Create a new product discount
  async createProductDiscount(
    discountData: IProductDiscount
  ): Promise<IProductDiscount> {
    try {
      const productDiscount = new ProductDiscount(discountData);
      return await productDiscount.save();
    } catch (error: any) {
      logger.error("Error creating product discount: ", error);
      throw new ApiError(500, "Failed to create product discount", [
        error.message,
      ]);
    }
  }

  // Retrieve all discounts
  async getAllProductDiscounts(): Promise<IProductDiscount[]> {
    try {
      return await ProductDiscount.find();
    } catch (error: any) {
      logger.error("Error fetching product discounts: ", error);
      throw new ApiError(500, "Failed to fetch product discounts", [
        error.message,
      ]);
    }
  }

  // Retrieve a single discount by ID
  async getProductDiscountById(id: string): Promise<IProductDiscount | null> {
    try {
      return await ProductDiscount.findById(id);
    } catch (error: any) {
      logger.error(`Error finding product discount by ID: ${id}`, error);
      throw new ApiError(500, "Failed to fetch product discount by ID", [
        error.message,
      ]);
    }
  }

  // Update a product discount by ID
  async updateProductDiscountById(
    id: string,
    updateData: Partial<IProductDiscount>
  ): Promise<IProductDiscount | null> {
    try {
      return await ProductDiscount.findByIdAndUpdate(id, updateData, {
        new: true,
      });
    } catch (error: any) {
      logger.error(`Error updating product discount by ID: ${id}`, error);
      throw new ApiError(500, "Failed to update product discount", [
        error.message,
      ]);
    }
  }

  // Deactivate/Activate a product discount
  async toggleDiscountActive(
    id: string,
    active: boolean
  ): Promise<IProductDiscount | null> {
    try {
      return await ProductDiscount.findByIdAndUpdate(
        id,
        { active },
        { new: true }
      );
    } catch (error: any) {
      logger.error(
        `Error toggling product discount's active status by ID: ${id}`,
        error
      );
      throw new ApiError(500, "Failed to toggle discount active status", [
        error.message,
      ]);
    }
  }

  // Delete a discount by ID
  async deleteProductDiscountById(
    id: string
  ): Promise<IProductDiscount | null> {
    try {
      return await ProductDiscount.findByIdAndDelete(id);
    } catch (error: any) {
      logger.error(`Error deleting product discount by ID: ${id}`, error);
      throw new ApiError(500, "Failed to delete product discount", [
        error.message,
      ]);
    }
  }
}

export default new ProductDiscountRepository();
