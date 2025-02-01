import IProduct from "../../../../entities/product/IProduct";
import productCategoryRepository from "../../../../repository/product/productCategoryRepository";
import productRepository from "../../../../repository/product/productRepository";
import ApiError from "../../../../utils/apiError";
import cleanUpAvatar from "../../../../utils/avatarCleanup";
import uploadToCloudinary from "../../../../utils/cloudinary";

const createProduct = async (data: Partial<IProduct>) => {
  const existingCategory =
    await productCategoryRepository.getProductCategoryById(
      data.categoryId as string
    );
  if (!existingCategory) {
    if (data?.images && data?.images.length > 0) {
      // Upload images to Cloudinary
      data.images.map(async (file) => {
        await cleanUpAvatar(file);
      });
      throw new ApiError(400, "Invalid categoryId");
    }
  }
  // Check if images are provided
  if (data?.images && data?.images.length > 0) {
    // Upload images to Cloudinary
    const uploadPromises = data.images.map(async (file) => {
      const secureUrl = await uploadToCloudinary(file, "/products"); // Upload the image to Cloudinary
      await cleanUpAvatar(file);
      return secureUrl; // Return the secure URL of the uploaded image
    });

    // Wait for all image uploads to complete
    const imageUrls = await Promise.all(uploadPromises);

    // Update product data with the image URLs
    data.images = imageUrls;
  }

  // Create the new product with the updated data (including the image URLs)
  const newProduct = await productRepository.createProduct(data);

  return { message: "Product created successfully", newProduct };
};

export default createProduct;
