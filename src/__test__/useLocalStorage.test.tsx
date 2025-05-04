import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../utility/common';

describe('useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('returns initial value if nothing in localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('sets and persists value', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'default'));
    act(() => {
      result.current[1]('newValue');
    });
    expect(result.current[0]).toBe('newValue');
    expect(window.localStorage.getItem('testKey')).toBe(JSON.stringify('newValue'));
  });

  it('restores value from localStorage', () => {
    window.localStorage.setItem('testKey', JSON.stringify('persisted'));
    const { result } = renderHook(() => useLocalStorage('testKey', 'default'));
    expect(result.current[0]).toBe('persisted');
  });
});
