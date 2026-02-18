import api from './apiConfig';

export const getVapidPublicKey = async () => {
  const resp = await api.get('/web_push/vapid_key');
  return resp.data.vapid_public_key;
};

export const createWebPushSubscription = async (subscription) => {
  const json = subscription.toJSON();
  const resp = await api.post('/web_push_subscriptions', {
    endpoint: json.endpoint,
    p256dh: json.keys.p256dh,
    auth: json.keys.auth,
  });
  return resp.data;
};

export const removeWebPushSubscription = async (id) => {
  const resp = await api.delete(`/web_push_subscriptions/${id}`);
  return resp;
};
