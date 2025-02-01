import uiUpdateRepository from "../../../repository/admin/uiUpdateRepository";

const getUiUpdate = async () => {
  const res = await uiUpdateRepository.getUiUpdate();
  return { data: res?.uiUpdates, message: "fetched banners successfully" };
};

export default getUiUpdate;
