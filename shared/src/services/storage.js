let _storage = null;

export const setStorage = (impl) => {
  _storage = impl;
};

export const getStorage = () => {
  if (!_storage) {
    throw new Error('Storage not initialized. Call setStorage() first.');
  }
  return _storage;
};
