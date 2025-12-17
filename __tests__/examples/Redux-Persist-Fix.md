## 🔧 Redux Persist Open Handles Issue - SOLVED

### ❌ **The Problem**

```
Jest has detected the following 1 open handle potentially keeping Jest from exiting:

●  Timeout

  32 | export const persistor = persistStore(store);
     |                                      ^
```

### 🤔 **Why This Happens**

**Redux Persist uses `setTimeout` internally:**

```tsx
// Inside redux-persist source code
setTimeout(() => {
  // Persist state to storage
}, DEBOUNCE_TIME);
```

**The flow:**

1. Your test imports a component
2. Component imports Redux store
3. `store.tsx` executes `persistStore(store)` at module load time
4. `persistStore()` starts timers for persistence operations
5. Test completes but timers are still active
6. Jest detects open timers and warns they prevent clean exit

### 🎯 **The Solution**

Mock `redux-persist` in `jest-setup.ts` to disable actual persistence during tests:

```tsx
// jest-setup.ts
jest.mock('redux-persist', () => {
  const actual = jest.requireActual('redux-persist');
  return {
    ...actual,
    persistReducer: jest.fn((config, reducer) => reducer), // Return unwrapped reducer
    persistStore: jest.fn(() => ({
      purge: jest.fn(),
      flush: jest.fn(),
      pause: jest.fn(),
      persist: jest.fn(),
    })),
  };
});
```

### 🔍 **What This Mock Does**

| Function                   | Original Behavior              | Mocked Behavior                        |
| -------------------------- | ------------------------------ | -------------------------------------- |
| `persistReducer`           | Wraps reducer to persist state | Returns original reducer (no wrapping) |
| `persistStore`             | Starts persistence with timers | Returns mock object (no timers)        |
| `FLUSH`, `REHYDRATE`, etc. | Action type constants          | Pass through unchanged                 |

### ✅ **Benefits**

1. **No open handles** - No timers remain after tests
2. **Faster tests** - No actual storage operations
3. **More reliable** - No dependency on AsyncStorage
4. **Cleaner** - Tests focus on logic, not persistence
5. **Isolated** - Each test gets fresh state

### 🧪 **Before vs After**

#### Before (❌ Open Handle Warning):

```bash
Jest has detected the following 1 open handle...
  ●  Timeout
      32 | export const persistor = persistStore(store);
```

#### After (✅ Clean Exit):

```bash
Test Suites: 11 passed, 11 total
Tests:       90 passed, 90 total
Time:        14.007 s
✨ No warnings!
```

### 💡 **Why Not Use Real Persistence in Tests?**

| Issue           | Impact                                        |
| --------------- | --------------------------------------------- |
| **Slow**        | Storage I/O operations add latency            |
| **Flaky**       | AsyncStorage can fail or timeout              |
| **Stateful**    | Tests can interfere with each other           |
| **Complex**     | Need to clear storage before/after tests      |
| **Unnecessary** | Unit tests shouldn't test persistence library |

### 🔄 **Alternative Solutions (Not Recommended)**

#### Option 1: Create test-specific store

```tsx
// ❌ Requires changing test setup everywhere
const createTestStore = () =>
  configureStore({
    reducer: rootReducer, // Without persistReducer
  });
```

#### Option 2: Mock AsyncStorage

```tsx
// ❌ Still has timers, just different storage
jest.mock('@react-native-async-storage/async-storage');
```

#### Option 3: Use fake timers

```tsx
// ❌ Complicated, affects all timers in tests
jest.useFakeTimers();
jest.runAllTimers();
```

### 📝 **Testing Persistence Logic Separately**

If you need to test actual persistence behavior:

```tsx
// Create a separate integration test file
describe('Redux Persistence (Integration)', () => {
  // Don't use the mocked version
  jest.unmock('redux-persist');

  const { store, persistor } = require('../src/redux/store');

  it('should persist user data', async () => {
    // Test actual persistence
    store.dispatch(setUser({ id: 1 }));

    await persistor.flush();

    // Verify data in AsyncStorage
    const stored = await AsyncStorage.getItem('persist:root');
    expect(JSON.parse(stored).user).toBeTruthy();
  });

  afterEach(async () => {
    await persistor.purge();
  });
});
```

### 🎓 **Key Takeaways**

1. ✅ **Always mock redux-persist in jest-setup.ts**
2. ✅ **Unit tests shouldn't test persistence (library responsibility)**
3. ✅ **Integration tests can unmock for specific persistence testing**
4. ✅ **Use `--detectOpenHandles` to catch timer leaks**
5. ✅ **Mock at setup level (not in individual test files)**

### 🔍 **How to Detect Open Handles**

```bash
# Run with detection
npx jest --detectOpenHandles

# If you see warnings, check for:
- setTimeout/setInterval not cleared
- Promises not resolved
- Network requests not completed
- Database connections not closed
- File handles not closed
```

### 📚 **Related Issues**

This same pattern applies to other libraries that use timers:

- `redux-persist` ← We fixed this
- `react-native-reanimated` ← Already mocked
- `react-native-gesture-handler` ← Already mocked
- Any custom timers in your code ← Use `jest.clearAllTimers()` in `afterEach`

---

**Summary:** Mock `redux-persist` in `jest-setup.ts` to prevent timers from keeping Jest alive. Unit tests shouldn't test persistence anyway - that's the library's job!
