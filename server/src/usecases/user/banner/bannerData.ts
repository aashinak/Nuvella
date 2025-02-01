import redisClient from "../../../config/redis/redis-client";
import uiUpdateRepository from "../../../repository/admin/uiUpdateRepository";

const getBanners = async () => {
  // Check if the banners data is cached in Redis
  const cachedBanners = await redisClient.get("banners");

  if (cachedBanners) {
    // If the banners data is cached, return the cached data
    return {
      data: JSON.parse(cachedBanners),
      message: "fetched banners successfully",
    };
  }

  // If not cached, fetch the data from the repository
  const res = await uiUpdateRepository.getUiUpdate();

  // Cache the fetched data in Redis for future requests (set expiration time to 1 hour)
  await redisClient.setex("banners", 3600, JSON.stringify(res?.uiUpdates));

  return { data: res?.uiUpdates, message: "fetched banners successfully" };
};

export default getBanners;
