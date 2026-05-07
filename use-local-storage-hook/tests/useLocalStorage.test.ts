import { renderHook, act } from '@testing-library/react';
import useLocalStorage from '../src/useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    // Clear localStorage mock before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should return initial value when localStorage is empty', () => {
    localStorage.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    expect(result.current[0]).toBe('initial');
    expect(localStorage.getItem).toHaveBeenCalledWith('test-key');
  });

  it('should return stored value when localStorage has data', () => {
    localStorage.getItem.mockReturnValue(JSON.stringify('stored-value'));

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    expect(result.current[0]).toBe('stored-value');
  });

  it('should handle JSON parsing errors gracefully', () => {
    localStorage.getItem.mockReturnValue('invalid-json');

    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    expect(result.current[0]).toBe('initial');
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error reading localStorage key "test-key":',
      expect.any(SyntaxError)
    );

    consoleSpy.mockRestore();
  });

  it('should update localStorage when setValue is called', () => {
    localStorage.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('new-value');
    });

    expect(result.current[0]).toBe('new-value');
    expect(localStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify('new-value'));
  });

  it('should handle setValue with function updater', () => {
    localStorage.getItem.mockReturnValue(JSON.stringify(5));

    const { result } = renderHook(() => useLocalStorage('test-key', 0));

    act(() => {
      result.current[1](prev => prev + 1);
    });

    expect(result.current[0]).toBe(6);
    expect(localStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify(6));
  });

  it('should handle localStorage setItem errors gracefully', () => {
    localStorage.getItem.mockReturnValue(null);
    localStorage.setItem.mockImplementation(() => {
      throw new Error('Storage quota exceeded');
    });

    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('new-value');
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error setting localStorage key "test-key":',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it('should work with complex objects', () => {
    const initialValue = { name: 'John', age: 30 };
    localStorage.getItem.mockReturnValue(JSON.stringify(initialValue));

    const { result } = renderHook(() => useLocalStorage('user', { name: '', age: 0 }));

    expect(result.current[0]).toEqual(initialValue);

    const newValue = { name: 'Jane', age: 25 };
    act(() => {
      result.current[1](newValue);
    });

    expect(result.current[0]).toEqual(newValue);
    expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(newValue));
  });
});