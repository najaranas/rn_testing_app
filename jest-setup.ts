import '@testing-library/react-native/extend-expect';
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
// include this line for mocking react-native-gesture-handler
import 'react-native-gesture-handler/jestSetup';

// include this section and the NativeAnimatedHelper section for mocking react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};

  return Reanimated;
});

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

/**
 * Mock redux-persist to prevent open handles in tests
 *
 * WHY?
 * - redux-persist uses setTimeout internally for debouncing
 * - These timers remain active after tests, preventing Jest from exiting
 * - In tests, we don't need actual persistence (storage operations)
 *
 * WHAT THIS DOES:
 * - persistReducer: Returns the original reducer without persistence
 * - persistStore: Returns a mock persistor that does nothing
 * - FLUSH, REHYDRATE, etc.: Pass through as-is (they're just action types)
 */
jest.mock('redux-persist', () => {
  const actual = jest.requireActual('redux-persist');
  return {
    ...actual,
    persistReducer: jest.fn((config, reducer) => reducer), // Just return the reducer
    persistStore: jest.fn(() => ({
      purge: jest.fn(),
      flush: jest.fn(),
      pause: jest.fn(),
      persist: jest.fn(),
    })),
  };
});
