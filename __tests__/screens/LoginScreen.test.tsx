import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import LoginScreen from '../../src/screens/LoginScreen';

// Create a mock store for testing
const createTestStore = () =>
  configureStore({
    reducer: {
      user: (state = { user: null, loading: false, error: null }) => state,
    },
  });

// Helper to render with Redux Provider
const renderWithProvider = (component: React.ReactElement) => {
  const store = createTestStore();
  return render(<Provider store={store}>{component}</Provider>);
};

jest.mock('../../src/utils/NavigationUtil', () => ({
  navigate: jest.fn(),
}));

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render components correctly', () => {
      renderWithProvider(<LoginScreen />);
      expect(screen.getByPlaceholderText('Email')).toBeTruthy();
      expect(screen.getByPlaceholderText('Password')).toBeTruthy();
      expect(screen.getByTestId('Login')).toBeTruthy();
    });

    it('should render inputs with empty initial values', () => {
      renderWithProvider(<LoginScreen />);
      expect(screen.getByPlaceholderText('Email').props.value).toBe('');
      expect(screen.getByPlaceholderText('Password').props.value).toBe('');
    });
  });

  describe('Input handling', () => {
    it('should update inputs when user type', () => {
      renderWithProvider(<LoginScreen />);
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');

      expect(emailInput.props.value).toBe('test@example.com');
      expect(passwordInput.props.value).toBe('password123');
    });

    it('should clear email error when email input focus', () => {
      renderWithProvider(<LoginScreen />);
      const emailInput = screen.getByPlaceholderText('Email');
      const loginBtn = screen.getByTestId('Login');

      fireEvent(emailInput, 'changeText', '');
      fireEvent(loginBtn, 'press');
      expect(screen.getByText('Please enter your email')).toBeTruthy();

      fireEvent(emailInput, 'focus');
      expect(screen.queryByText('Please enter your email')).toBeNull();
    });

    it('should clear password error when password input focus', () => {
      renderWithProvider(<LoginScreen />);
      const passwordInput = screen.getByPlaceholderText('Password');

      const loginBtn = screen.getByTestId('Login');

      fireEvent(passwordInput, 'changeText', '');
      fireEvent(loginBtn, 'press');
      expect(screen.getByText('Enter your password')).toBeTruthy();

      fireEvent(passwordInput, 'focus');
      expect(screen.queryByText('Enter your password')).toBeNull();
    });
  });

  describe('input validation', () => {
    it('should show Please enter your email error when email empty', () => {
      renderWithProvider(<LoginScreen />);

      const emailInput = screen.getByPlaceholderText('Email');
      fireEvent.changeText(emailInput, '');

      const loginButton = screen.getByTestId('Login');
      fireEvent.press(loginButton);

      expect(screen.getByText('Please enter your email')).toBeTruthy();
    });

    it('should show Please enter a valid email error when email is invalid', () => {
      renderWithProvider(<LoginScreen />);

      const emailInput = screen.getByPlaceholderText('Email');
      fireEvent.changeText(emailInput, 'test.com');

      const loginButton = screen.getByTestId('Login');
      fireEvent.press(loginButton);

      expect(screen.getByText('Please enter a valid email')).toBeTruthy();
    });

    it('should show error when password is empty', () => {
      renderWithProvider(<LoginScreen />);

      const passwordInput = screen.getByPlaceholderText('Password');

      fireEvent.changeText(passwordInput, '');
      const loginButton = screen.getByTestId('Login');
      fireEvent.press(loginButton);

      expect(screen.getByText('Enter your password')).toBeTruthy();
    });

    it('should no show error when email & passowrd are valid', () => {
      renderWithProvider(<LoginScreen />);

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      const loginBtn = screen.getByTestId('Login');

      fireEvent(emailInput, 'changeText', 'test@gmail.cpm');
      fireEvent(passwordInput, 'changeText', '1234');
      fireEvent(loginBtn, 'press');

      expect(screen.queryByText('Please enter your email')).toBeNull();
      expect(screen.queryByText('Please enter a valid email')).toBeNull();
      expect(screen.queryByText('Enter your password')).toBeNull();
    });
  });
});
