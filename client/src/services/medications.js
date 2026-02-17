import api from "./apiConfig";

export const getRXGuideMeds = async () => {
  const resp = await api.get("/medications/rx_guide");
  return resp.data;
};

export const getAllMeds = async () => {
  try {
    const resp = await api.get("/medications");
    return resp?.data;
  } catch (error) {
    throw error;
  }
};

export const getOneMed = async (id) => {
  const resp = await api.get(`/medications/${id}`);
  return resp.data;
};

export const postMed = async (medData) => {
  const resp = await api.post("/medications", { medication: medData });
  return resp.data;
};

export const putMed = async (id, medData) => {
  const resp = await api.put(`/medications/${id}`, {
    medication: medData,
  });
  return resp.data;
};

export const destroyMed = async (id) => {
  const resp = await api.delete(`/medications/${id}`);
  return resp;
};
