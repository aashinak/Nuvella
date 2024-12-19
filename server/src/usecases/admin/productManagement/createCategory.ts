import adminRepository from "../../../repository/admin/adminRepository";
import productCategoryRepository from "../../../repository/product/productCategoryRepository";
import ApiError from "../../../utils/apiError";
import cleanUpAvatar from "../../../utils/avatarCleanup";
import uploadToCloudinary from "../../../utils/cloudinary";

interface categoryData {
  name: string;
  categoryImageLocalPath: string;
  adminId: string;
}

const createCategory = async (data: categoryData) => {
  // check if admin exists
  const admin = await adminRepository.findById(data.adminId);
  if (!admin || !admin.isVerified) {
    await cleanUpAvatar(data.categoryImageLocalPath);
    throw new ApiError(400, "Invalid admin");
  }
  // check if categoryName already exists
  const isCategoryExists =
    await productCategoryRepository.getProductCategoryByName(data.name);
  if (isCategoryExists) {
    await cleanUpAvatar(data.categoryImageLocalPath);
    throw new ApiError(400, "Product category already exists");
  }
  // upload image
  const uploadedCategoryImage = await uploadToCloudinary(
    data.categoryImageLocalPath,
    "/category"
  );
  if (!uploadedCategoryImage) {
    await cleanUpAvatar(data.categoryImageLocalPath);
    throw new ApiError(500, "Image upload failed");
  }
  // create category
  const newCategory = await productCategoryRepository.createProductCategory({
    name: data.name,
    image: uploadedCategoryImage,
  });
  if (!newCategory) {
    await cleanUpAvatar(data.categoryImageLocalPath);
    throw new ApiError(500, "Category creation failed");
  }

  await cleanUpAvatar(data.categoryImageLocalPath);

  // respond with category created successfull
  const sanitizedCategory = {
    name: newCategory.name,
    image: newCategory.image,
    _id: newCategory._id,
  };

  return {
    message: "Category created successfully",
    newCategory: sanitizedCategory,
  };
};

export default createCategory;
