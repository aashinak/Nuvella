import IUserAddress from "../../../entities/user/IUserAddress";
import userAddressRepository from "../../../repository/user/userAddressRepository";
import userRepository from "../../../repository/user/userRepository";
import ApiError from "../../../utils/apiError";

type UpdateUserAddressInput = Omit<IUserAddress, "_id" | "userId">;

const updateUserAddress = async (
  data: UpdateUserAddressInput,
  userId: string,
  addressId: string
) => {
  const user = await userRepository.findUserById(userId);
  if (!user) throw new ApiError(400, "Invalid request");

  const newUserAddress = await userAddressRepository.updateAddressByIds(
    userId,
    addressId,
    data
  );
  if (!newUserAddress) {
    throw new ApiError(500, "Address didn't get updated");
  }

  return { message: "Address updated" };
};

export default updateUserAddress;
