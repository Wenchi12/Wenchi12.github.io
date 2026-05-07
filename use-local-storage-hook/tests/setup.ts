// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

global.localStorage = localStorageMock;

// Mock window for SSR tests
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});