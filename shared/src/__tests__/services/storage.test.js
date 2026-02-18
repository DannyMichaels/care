import { setStorage, getStorage } from '../../services/storage';

describe('storage service', () => {
  afterEach(() => {
    // Reset storage to avoid leaking between tests
    setStorage(null);
  });

  it('throws when getStorage called before setStorage', () => {
    expect(() => getStorage()).toThrow('Storage not initialized');
  });

  it('returns the storage adapter after setStorage', () => {
    const mockStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };

    setStorage(mockStorage);
    expect(getStorage()).toBe(mockStorage);
  });

  it('replaces the storage adapter on second setStorage call', () => {
    const first = { getItem: jest.fn(), setItem: jest.fn(), removeItem: jest.fn() };
    const second = { getItem: jest.fn(), setItem: jest.fn(), removeItem: jest.fn() };

    setStorage(first);
    expect(getStorage()).toBe(first);

    setStorage(second);
    expect(getStorage()).toBe(second);
  });
});
