import userCartRepository from "../../../repository/user/userCartRepository";

const getCheckoutItemsByIds = async (ids: string[]) => {
  const items = await userCartRepository.findByIds(ids);
  return { message: "Products fetched", data: items };
};

export default getCheckoutItemsByIds;
