import api from './apiConfig';

export const getAllBlocks = async () => {
  const resp = await api.get('/blocks');
  return resp.data;
};

export const postBlock = async (blockedId) => {
  const resp = await api.post('/blocks', { blocked_id: blockedId });
  return resp.data;
};

export const destroyBlock = async (id) => {
  const resp = await api.delete(`/blocks/${id}`);
  return resp;
};

export const unblockUser = async (userId) => {
  const resp = await api.delete(`/blocks/unblock/${userId}`);
  return resp;
};
