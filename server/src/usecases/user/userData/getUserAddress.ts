import IUserAddress from "../../../entities/user/IUserAddress";
import userAddressRepository from "../../../repository/user/userAddressRepository";
import userRepository from "../../../repository/user/userRepository";
import ApiError from "../../../utils/apiError";

const getUserAddress = async (userId: string) => {
  const user = await userRepository.findUserById(userId);
  if (!user) throw new ApiError(400, "Invalid request");
  const userAddresses = await userAddressRepository.getAddressesByUserId(
    userId
  );
  if (!userAddresses) {
    return { message: "Address fetch failed" };
  }
  return { message: "Addresses fetched", data: userAddresses };
};
export default getUserAddress;
