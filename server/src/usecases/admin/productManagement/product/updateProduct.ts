import IProduct from "../../../../entities/product/IProduct";
import productCategoryRepository from "../../../../repository/product/productCategoryRepository";
import productRepository from "../../../../repository/product/productRepository";
import ApiError from "../../../../utils/apiError";
import cleanUpAvatar from "../../../../utils/avatarCleanup";
import uploadToCloudinary from "../../../../utils/cloudinary";

interface UpdateProductData {
  productId: string;
  updateData: Partial<IProduct>;
}

const validateCategory = async (categoryId: string) => {
  const category = await productCategoryRepository.getProductCategoryById(
    categoryId
  );
  if (!category) {
    throw new ApiError(400, "Invalid categoryId");
  }
};

const uploadImages = async (images: string[]) => {
  return Promise.all(
    images.map(async (file) => {
      try {
        const secureUrl = await uploadToCloudinary(file, "/products");
        await cleanUpAvatar(file);
        return secureUrl;
      } catch (error) {
        // Handle individual image upload failure
        throw new ApiError(500, `Failed to upload image: ${file}`);
      }
    })
  );
};

const updateProduct = async (data: UpdateProductData) => {
  const { productId, updateData } = data;

  // Validate category ID if provided
  if (updateData.categoryId) {
    await validateCategory(updateData.categoryId);
  }

  // Handle image uploads if provided
  if (updateData.images && updateData.images.length > 0) {
    const imageUrls = await uploadImages(updateData.images);
    updateData.images = imageUrls;
  }

  // Update product in the repository
  const updatedProduct = await productRepository.updateProduct(
    productId,
    updateData
  );

  if (!updatedProduct) {
    throw new ApiError(404, "Could not update product");
  }

  return updatedProduct; // Ensure the updated product is returned
};

export default updateProduct;
