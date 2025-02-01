import userAddressRepository from "../../../repository/user/userAddressRepository";
import ApiError from "../../../utils/apiError";

const deleteUserAddress = async (addressId: string, userId: string) => {
  const deletedAddress = await userAddressRepository.deleteAddressById(
    addressId,
    userId
  );
  if (!deletedAddress) {
    throw new ApiError(400, "Invalid address");
  }
  return { message: "Address deleted" };
};

export default deleteUserAddress;
