import uiUpdateRepository from "../../../repository/admin/uiUpdateRepository";
import ApiError from "../../../utils/apiError";

const deleteUiUpdate = async (updateId: string) => {
  const res = await uiUpdateRepository.deleteUiUpdate(updateId);
  if (!res) {
    throw new ApiError(400, "Deletion failed");
  }
  return { message: "Banner deleted successfully" };
};

export default deleteUiUpdate;
