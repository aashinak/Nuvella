import uiUpdateRepository from "../../../repository/admin/uiUpdateRepository";
import ApiError from "../../../utils/apiError";
import logger from "../../../utils/logger";
import uploadToCloudinary from "../../../utils/cloudinary";
import cleanUpAvatar from "../../../utils/avatarCleanup";

interface UiUpdateData {
  heroImageLocalPath: string;
  heroText: string;
  subText1: string;
  subText2: string;
}

const uiUpdate = async (data: UiUpdateData) => {
  let uploadedHeroImage;
  try {
    uploadedHeroImage = await uploadToCloudinary(
      data.heroImageLocalPath,
      "/banners"
    );
  } catch (error) {
    await cleanUpAvatar(data.heroImageLocalPath);
    throw new ApiError(500, "Something went wrong with avatar upload");
  }
  if (!uploadedHeroImage) {
    await cleanUpAvatar(data.heroImageLocalPath);
    throw new ApiError(500, "Image upload failed");
  }

  // Update or create the single UI update document
  const updatedUiUpdate = await uiUpdateRepository.upsertUiUpdate({
    heroImage: uploadedHeroImage,
    heroText: data.heroText,
    subText1: data.subText1,
    subText2: data.subText2,
  });

  console.log(updatedUiUpdate);
  

  if (!updatedUiUpdate) {
    await cleanUpAvatar(data.heroImageLocalPath);
    logger.error(`Failed to update UI settings`);
    throw new ApiError(500, "Failed to update UI settings");
  }

  await cleanUpAvatar(data.heroImageLocalPath);

  return {
    message: "UI settings updated successfully",
    uiUpdate: updatedUiUpdate.uiUpdates,
  };
};

export default uiUpdate;
