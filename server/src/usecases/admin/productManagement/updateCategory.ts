import adminRepository from "../../../repository/admin/adminRepository";
import productCategoryRepository from "../../../repository/product/productCategoryRepository";
import ApiError from "../../../utils/apiError";
import cleanUpAvatar from "../../../utils/avatarCleanup";
import uploadToCloudinary from "../../../utils/cloudinary";

interface productCategoryData {
  name?: string;
  imageLocalPath?: string;
  categoryId: string;
  adminId: string;
}

const updateCategory = async (data: productCategoryData) => {
  // Check if admin exists
  const admin = await adminRepository.findById(data.adminId);
  if (!admin) {
    if (data.imageLocalPath) {
      await cleanUpAvatar(data.imageLocalPath); // Cleanup image if provided
    }
    throw new ApiError(400, "Invalid admin");
  }

  // Check if the category exists
  const category = await productCategoryRepository.getProductCategoryById(
    data.categoryId
  );
  if (!category) {
    if (data.imageLocalPath) {
      await cleanUpAvatar(data.imageLocalPath); // Cleanup image if provided
    }
    throw new ApiError(400, "Invalid category");
  }

  // Upload the new image if provided
  let uploadedImagePath: string | undefined;
  if (data.imageLocalPath) {
    try {
      uploadedImagePath = await uploadToCloudinary(
        data.imageLocalPath,
        "/category"
      );
    } catch (error: any) {
      throw new ApiError(500, "Failed to upload image to Cloudinary", [
        error.message,
      ]);
    }
  }

  // Update the category with new data
  const updatedCategory =
    await productCategoryRepository.updateProductCategoryById(data.categoryId, {
      name: data.name,
      image: uploadedImagePath || category.image, // If no new image, keep the old one
    });

  // Return the updated category or throw error if failed
  if (!updatedCategory) {
    throw new ApiError(500, "Failed to update category");
  }

  if (data.imageLocalPath) {
    await cleanUpAvatar(data.imageLocalPath);
  }

  return { message: "Category updated successfully", updatedCategory };
};

export default updateCategory;
