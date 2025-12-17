import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import LoginScreen from '../../src/screens/LoginScreen';
import { navigate } from '../../src/utils/NavigationUtil';
import userReducer, { loginUser } from '../../src/redux/reducers/userSlice';

// ============================================================================
// MOCKS
// ============================================================================

/**
 * Mock navigation utility
 *
 * WHY mock navigation?
 * - Prevents actual navigation during tests (which would fail)
 * - Allows us to verify navigation was called with correct params
 * - Isolates the component from external dependencies
 */
jest.mock('../../src/utils/NavigationUtil', () => ({
  navigate: jest.fn(),
}));

// ============================================================================
// TEST UTILITIES
// ============================================================================

/**
 * Creates a mock Redux store with the REAL user reducer
 *
 * WHY use the real reducer?
 * - Tests actual Redux integration, not just mocked behavior
 * - Catches bugs in reducers and async thunks
 * - More realistic test coverage
 *
 * @param preloadedState - Optional initial state for testing specific scenarios
 */
const createTestStore = (preloadedState = {}) =>
  configureStore({
    reducer: {
      user: userReducer,
    },
    preloadedState,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        // Disable serialization checks in tests to avoid console warnings
        serializableCheck: false,
      }),
  });

/**
 * Wrapper that provides Redux context to components
 *
 * PATTERN: Custom render function
 * - Avoids repeating Provider setup in every test
 * - Returns store reference for assertions on state
 * - Reusable across all tests requiring Redux
 */
const renderWithProvider = (
  component: React.ReactElement,
  { store = createTestStore() } = {},
) => {
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store, // Expose store for state assertions
  };
};

// ============================================================================
// TEST DATA (Constants)
// ============================================================================

/**
 * Centralized test data
 *
 * WHY?
 * - Single source of truth for test values
 * - Easy to update across all tests
 * - Makes tests more readable
 */
const TEST_DATA = {
  validCredentials: {
    email: 'test@example.com',
    password: 'Password123',
  },
  invalidEmails: [
    { value: '', expectedError: 'Please enter your email' },
    { value: '   ', expectedError: 'Please enter your email' },
    { value: 'invalid', expectedError: 'Please enter a valid email' },
    { value: 'invalid@', expectedError: 'Please enter a valid email' },
    { value: 'invalid@test', expectedError: 'Please enter a valid email' },
    { value: '@test.com', expectedError: 'Please enter a valid email' },
    { value: 'test@.com', expectedError: 'Please enter a valid email' },
  ],
  errors: {
    emptyEmail: 'Please enter your email',
    invalidEmail: 'Please enter a valid email',
    emptyPassword: 'Enter your password',
  },
};

// ============================================================================
// TESTS
// ============================================================================

describe('LoginScreen', () => {
  /**
   * Reset mocks before each test
   *
   * WHY?
   * - Ensures test isolation
   * - Prevents state leakage between tests
   * - Each test starts with clean slate
   */
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==========================================================================
  // 1. RENDERING TESTS
  // ==========================================================================
  describe('Rendering', () => {
    /**
     * Test: Initial component structure
     * - Verifies all required UI elements are present
     * - This is a "smoke test" - basic sanity check
     */
    it('should render all UI components correctly', () => {
      renderWithProvider(<LoginScreen />);

      // Heading + Button both show "Login"
      expect(screen.getAllByText('Login')).toHaveLength(2);

      // Input fields - use placeholder for identification
      expect(screen.getByPlaceholderText('Email')).toBeTruthy();
      expect(screen.getByPlaceholderText('Password')).toBeTruthy();

      // Button - use testID for reliable selection
      expect(screen.getByTestId('Login')).toBeTruthy();

      // Footer navigation link
      expect(screen.getByText("Don't have an account? Sign Up")).toBeTruthy();
    });

    /**
     * Test: Initial state
     * - Inputs should be empty on first render
     * - No error messages visible
     */
    it('should have empty input fields on initial render', () => {
      renderWithProvider(<LoginScreen />);

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');

      // Check actual values, not just existence
      expect(emailInput.props.value).toBe('');
      expect(passwordInput.props.value).toBe('');
    });

    it('should not display any validation errors initially', () => {
      renderWithProvider(<LoginScreen />);

      expect(screen.queryByText(TEST_DATA.errors.emptyEmail)).toBeNull();
      expect(screen.queryByText(TEST_DATA.errors.invalidEmail)).toBeNull();
      expect(screen.queryByText(TEST_DATA.errors.emptyPassword)).toBeNull();
    });
  });

  // ==========================================================================
  // 2. USER INTERACTION TESTS
  // ==========================================================================
  describe('User Interactions', () => {
    /**
     * Test: Controlled input behavior
     * - Verifies state updates when user types
     */
    it('should update email input when user types', () => {
      renderWithProvider(<LoginScreen />);

      const emailInput = screen.getByPlaceholderText('Email');
      fireEvent.changeText(emailInput, TEST_DATA.validCredentials.email);

      expect(emailInput.props.value).toBe(TEST_DATA.validCredentials.email);
    });

    it('should update password input when user types', () => {
      renderWithProvider(<LoginScreen />);

      const passwordInput = screen.getByPlaceholderText('Password');
      fireEvent.changeText(passwordInput, TEST_DATA.validCredentials.password);

      expect(passwordInput.props.value).toBe(
        TEST_DATA.validCredentials.password,
      );
    });

    /**
     * Test: Navigation to registration
     * - Verifies footer link navigates correctly
     */
    it('should navigate to RegisterScreen when footer link is pressed', () => {
      renderWithProvider(<LoginScreen />);

      const signUpLink = screen.getByText("Don't have an account? Sign Up");
      fireEvent.press(signUpLink);

      expect(navigate).toHaveBeenCalledTimes(1);
      expect(navigate).toHaveBeenCalledWith('RegisterScreen');
    });
  });

  // ==========================================================================
  // 3. VALIDATION TESTS
  // ==========================================================================
  describe('Validation', () => {
    // ------------------------------------------------------------------------
    // Email Validation
    // ------------------------------------------------------------------------
    describe('Email Validation', () => {
      /**
       * Parameterized test using it.each()
       *
       * WHY?
       * - Tests multiple scenarios without code duplication
       * - Easy to add new test cases
       * - Clear output showing which case failed
       */
      it.each(TEST_DATA.invalidEmails)(
        'should show error "$expectedError" when email is "$value"',
        ({ value, expectedError }) => {
          renderWithProvider(<LoginScreen />);

          const emailInput = screen.getByPlaceholderText('Email');
          const passwordInput = screen.getByPlaceholderText('Password');
          const loginButton = screen.getByTestId('Login');

          fireEvent.changeText(emailInput, value);
          fireEvent.press(loginButton);

          expect(screen.getByText(expectedError)).toBeTruthy();
        },
      );

      it('should accept valid email format', () => {
        renderWithProvider(<LoginScreen />);

        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Password');
        const loginButton = screen.getByTestId('Login');

        fireEvent.changeText(emailInput, TEST_DATA.validCredentials.email);
        fireEvent.changeText(
          passwordInput,
          TEST_DATA.validCredentials.password,
        );
        fireEvent.press(loginButton);

        // No email errors should be shown
        expect(screen.queryByText(TEST_DATA.errors.emptyEmail)).toBeNull();
        expect(screen.queryByText(TEST_DATA.errors.invalidEmail)).toBeNull();
      });
    });

    // ------------------------------------------------------------------------
    // Password Validation
    // ------------------------------------------------------------------------
    describe('Password Validation', () => {
      it('should show error when password is empty', () => {
        renderWithProvider(<LoginScreen />);

        const emailInput = screen.getByPlaceholderText('Email');
        const loginButton = screen.getByTestId('Login');

        // Fill email but leave password empty
        fireEvent.changeText(emailInput, TEST_DATA.validCredentials.email);
        fireEvent.press(loginButton);

        expect(screen.getByText(TEST_DATA.errors.emptyPassword)).toBeTruthy();
      });

      it('should show error when password contains only whitespace', () => {
        renderWithProvider(<LoginScreen />);

        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Password');
        const loginButton = screen.getByTestId('Login');

        fireEvent.changeText(emailInput, TEST_DATA.validCredentials.email);
        fireEvent.changeText(passwordInput, '   ');
        fireEvent.press(loginButton);

        expect(screen.getByText(TEST_DATA.errors.emptyPassword)).toBeTruthy();
      });
    });

    // ------------------------------------------------------------------------
    // Combined Validation
    // ------------------------------------------------------------------------
    describe('Combined Validation', () => {
      it('should show multiple errors when both fields are invalid', () => {
        renderWithProvider(<LoginScreen />);

        const loginButton = screen.getByTestId('Login');
        fireEvent.press(loginButton);

        // Both errors should appear
        expect(screen.getByText(TEST_DATA.errors.emptyEmail)).toBeTruthy();
        expect(screen.getByText(TEST_DATA.errors.emptyPassword)).toBeTruthy();
      });

      it('should not show errors when both fields are valid', () => {
        renderWithProvider(<LoginScreen />);

        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Password');
        const loginButton = screen.getByTestId('Login');

        fireEvent.changeText(emailInput, TEST_DATA.validCredentials.email);
        fireEvent.changeText(
          passwordInput,
          TEST_DATA.validCredentials.password,
        );
        fireEvent.press(loginButton);

        expect(screen.queryByText(TEST_DATA.errors.emptyEmail)).toBeNull();
        expect(screen.queryByText(TEST_DATA.errors.invalidEmail)).toBeNull();
        expect(screen.queryByText(TEST_DATA.errors.emptyPassword)).toBeNull();
      });
    });

    // ------------------------------------------------------------------------
    // Error Clearing on Focus
    // ------------------------------------------------------------------------
    describe('Error Clearing', () => {
      it('should clear email error when email input is focused', () => {
        renderWithProvider(<LoginScreen />);

        const emailInput = screen.getByPlaceholderText('Email');
        const loginButton = screen.getByTestId('Login');

        // Trigger validation error
        fireEvent.press(loginButton);
        expect(screen.getByText(TEST_DATA.errors.emptyEmail)).toBeTruthy();

        // Focus should clear the error
        fireEvent(emailInput, 'focus');
        expect(screen.queryByText(TEST_DATA.errors.emptyEmail)).toBeNull();
      });

      it('should clear password error when password input is focused', () => {
        renderWithProvider(<LoginScreen />);

        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Password');
        const loginButton = screen.getByTestId('Login');

        // Fill email to isolate password error
        fireEvent.changeText(emailInput, TEST_DATA.validCredentials.email);
        fireEvent.press(loginButton);
        expect(screen.getByText(TEST_DATA.errors.emptyPassword)).toBeTruthy();

        // Focus should clear the error
        fireEvent(passwordInput, 'focus');
        expect(screen.queryByText(TEST_DATA.errors.emptyPassword)).toBeNull();
      });
    });
  });

  // ==========================================================================
  // 4. LOGIN FLOW (Integration Tests)
  // ==========================================================================
  describe('Login Flow', () => {
    /**
     * Test: Failed validation should NOT trigger login
     *
     * EXPLANATION:
     * - We can't spy on the loginUser thunk directly without mocking it
     * - Instead, we verify behavior: no navigation happens when validation fails
     * - This is a better approach as it tests actual user-facing behavior
     */

    it('should NOT navigate when validation fails', async () => {
      const store = createTestStore();
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      renderWithProvider(<LoginScreen />, { store });

      const loginButton = screen.getByTestId('Login');
      fireEvent.press(loginButton);

      expect(screen.getByTestId('Login')).toBeTruthy();

      // Check that dispatch was NOT called with loginUser action
      expect(dispatchSpy).not.toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.stringMatching(/^user\/loginUser/),
        }),
      );

      expect(navigate).not.toHaveBeenCalled();
    });

    /**
     * Test: Redux thunk returns fulfilled action
     *
     * EXPLANATION:
     * - This tests the thunk in isolation (unit test of Redux logic)
     * - Verifies the async thunk completes successfully with valid data
     * - Action.type will be 'user/loginUser/fulfilled' on success
     */
    it('should dispatch fulfilled action when thunk is called with valid credentials', async () => {
      const store = createTestStore();

      const action = await store.dispatch(
        loginUser({
          email: TEST_DATA.validCredentials.email,
          password: TEST_DATA.validCredentials.password,
        }),
      );

      // Check that the action returned is a fulfilled action
      expect(action.type).toBe(loginUser.fulfilled.type);
      expect(action.payload).toEqual(TEST_DATA.validCredentials);
    });

    /**
     * Test: Redux thunk returns rejected action
     *
     * EXPLANATION:
     * - Tests the thunk's error handling
     * - loginUser rejects when email or password are missing
     * - Action.type will be 'user/loginUser/rejected' on failure
     */
    it('should dispatch rejected action when thunk receives invalid credentials', async () => {
      const store = createTestStore();

      // Dispatch thunk directly with empty credentials (triggers rejection)
      const action = await store.dispatch(
        loginUser({ email: '', password: '' }),
      );

      // The action should be rejected
      expect(action.type).toBe(loginUser.rejected.type);
    });

    /**
     * Test: Full integration - UI to Redux state update
     *
     * EXPLANATION:
     * - This is an end-to-end integration test
     * - Tests: User input → Validation → Redux dispatch → State update → Navigation
     * - Uses waitFor because loginUser has a 1-second setTimeout
     */
    it('should update Redux store with user data after successful login', async () => {
      const store = createTestStore();
      renderWithProvider(<LoginScreen />, { store });

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      const loginButton = screen.getByTestId('Login');

      // Fill in valid credentials
      fireEvent.changeText(emailInput, TEST_DATA.validCredentials.email);
      fireEvent.changeText(passwordInput, TEST_DATA.validCredentials.password);

      // Press login button
      fireEvent.press(loginButton);

      // Wait for async thunk to complete and state to update
      await waitFor(
        () => {
          const state = store.getState();
          expect(state.user.user).toEqual(TEST_DATA.validCredentials);
        },
        { timeout: 2000 }, // Give enough time for the 1-second delay in thunk
      );

      // Verify navigation happened after successful login
      expect(navigate).toHaveBeenCalledWith('HomeScreen');
    });
  });
});
