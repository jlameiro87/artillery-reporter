import '@testing-library/jest-dom';

// Only define ResizeObserver in test (Node.js) environments
if (typeof globalThis !== 'undefined') {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
