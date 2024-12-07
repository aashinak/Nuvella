import adminRepository from "../../repository/admin/adminRepository";
import ApiError from "../../utils/apiError";

const isAdminExists = async (adminId: string) => {
  const isAdmin = await adminRepository.findById(adminId);
  if (!isAdmin) {
    throw new ApiError(400, "Admin doesn't exists");
  }

  return true;
};

export default isAdminExists;
