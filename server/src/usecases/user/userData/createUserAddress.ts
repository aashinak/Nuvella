import IUserAddress from "../../../entities/user/IUserAddress";
import userAddressRepository from "../../../repository/user/userAddressRepository";
import userRepository from "../../../repository/user/userRepository";
import ApiError from "../../../utils/apiError";

const createUserAddress = async (data: IUserAddress) => {
  const user = await userRepository.findUserById(data.userId);
  if (!user) throw new ApiError(400, "Invalid request");
  const newUserAddress = await userAddressRepository.createAddress(data);
  if (!newUserAddress) {
    throw new ApiError(500, "Address didnt added");
  }
  return { message: "Added new address", address: newUserAddress };
};
export default createUserAddress;
