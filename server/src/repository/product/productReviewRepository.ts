import ProductReview from "../../models/product/productReviewModel";
import IProductReview from "../../entities/product/IProductReview";
import logger from "../../utils/logger";
import ApiError from "../../utils/apiError";

class ProductReviewRepository {
  // Create a new product review
  async createReview(reviewData: IProductReview): Promise<IProductReview> {
    try {
      const review = new ProductReview(reviewData);
      return await review.save();
    } catch (error: any) {
      logger.error("Error creating product review: ", error);
      throw new ApiError(500, "Failed to create product review", [
        error.message,
      ]);
    }
  }

  // Get all product reviews
  async getAllReviews(): Promise<IProductReview[]> {
    try {
      return await ProductReview.find();
    } catch (error: any) {
      logger.error("Error fetching all product reviews: ", error);
      throw new ApiError(500, "Failed to fetch product reviews", [
        error.message,
      ]);
    }
  }

  // Get a specific review by ID
  async getReviewById(id: string): Promise<IProductReview | null> {
    try {
      return await ProductReview.findById(id);
    } catch (error: any) {
      logger.error(`Error fetching product review by ID: ${id}`, error);
      throw new ApiError(500, "Failed to fetch product review by ID", [
        error.message,
      ]);
    }
  }

  // Update a review by ID
  async updateReview(
    id: string,
    updateData: Partial<IProductReview>
  ): Promise<IProductReview | null> {
    try {
      return await ProductReview.findByIdAndUpdate(id, updateData, {
        new: true,
      });
    } catch (error: any) {
      logger.error(`Error updating product review by ID: ${id}`, error);
      throw new ApiError(500, "Failed to update product review", [
        error.message,
      ]);
    }
  }

  // Delete a review by ID
  async deleteReview(id: string): Promise<IProductReview | null> {
    try {
      return await ProductReview.findByIdAndDelete(id);
    } catch (error: any) {
      logger.error(`Error deleting product review by ID: ${id}`, error);
      throw new ApiError(500, "Failed to delete product review", [
        error.message,
      ]);
    }
  }
}

export default new ProductReviewRepository();
