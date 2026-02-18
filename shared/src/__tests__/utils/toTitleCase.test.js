import { toTitleCase } from '../../utils/toTitleCase';

describe('toTitleCase', () => {
  it('converts a lowercase string to title case', () => {
    expect(toTitleCase('hello world')).toBe('Hello World');
  });

  it('converts an uppercase string to title case', () => {
    expect(toTitleCase('HELLO WORLD')).toBe('Hello World');
  });

  it('handles mixed case', () => {
    expect(toTitleCase('hELLo wORLd')).toBe('Hello World');
  });

  it('handles single word', () => {
    expect(toTitleCase('hello')).toBe('Hello');
  });

  it('handles undefined', () => {
    expect(toTitleCase(undefined)).toBeUndefined();
  });

  it('handles null', () => {
    expect(toTitleCase(null)).toBeUndefined();
  });
});
