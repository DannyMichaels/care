import { checkValidity } from '../../utils/checkValidity';

describe('checkValidity', () => {
  it('returns true for whitelisted paths', () => {
    expect(checkValidity('/')).toBe(true);
    expect(checkValidity('/login')).toBe(true);
    expect(checkValidity('/register')).toBe(true);
    expect(checkValidity('/insights')).toBe(true);
    expect(checkValidity('/settings')).toBe(true);
    expect(checkValidity('/moods')).toBe(true);
    expect(checkValidity('/symptoms')).toBe(true);
    expect(checkValidity('/affirmations')).toBe(true);
    expect(checkValidity('/foods')).toBe(true);
    expect(checkValidity('/medications')).toBe(true);
    expect(checkValidity('/users')).toBe(true);
    expect(checkValidity('/user')).toBe(true);
  });

  it('returns true for subpaths of whitelisted paths', () => {
    expect(checkValidity('/insights/123')).toBe(true);
    expect(checkValidity('/users/1')).toBe(true);
  });

  it('returns false for non-whitelisted paths', () => {
    expect(checkValidity('/admin')).toBe(false);
    expect(checkValidity('/random')).toBe(false);
    expect(checkValidity('/api/something')).toBe(false);
  });
});
