import { Provider } from 'react-redux';
import { store } from '../../src/redux/store';
import RegisterScreen from '../../src/screens/RegisterScreen';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { navigate } from '../../src/utils/NavigationUtil';

const TEST_DATA = {
  validCredentials: {
    firstName: 'Anas',
    LastName: 'Najar',
    email: 'test@gmail.com',
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
  erors: {
    emptyFirstName: 'Please enter your first name',
    emptyLastName: 'Enter your last name',
    emptyEmail: 'Please enter your email',
    emptyPassWord: 'Enter your password',
    invalidEmail: 'Please enter a valid email',
  },
};

const renderWithProvider = (children: any) => {
  render(<Provider store={store}>{children}</Provider>);
};

jest.mock('../../src/utils/NavigationUtil', () => ({
  navigate: jest.fn(),
}));

describe('RegisterScreen', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should rendering all ui components', () => {
      renderWithProvider(<RegisterScreen />);
      expect(screen.getAllByText('Sign Up')).toHaveLength(2);
      expect(screen.getByPlaceholderText('First name')).toBeTruthy();
      expect(screen.getByPlaceholderText('Last name')).toBeTruthy();
      expect(screen.getByPlaceholderText('Email')).toBeTruthy();
      expect(screen.getByPlaceholderText('Password')).toBeTruthy();
      expect(screen.getByTestId('Register')).toBeTruthy();
      expect(
        screen.getByText('Already have an account? Login In'),
      ).toBeTruthy();
    });

    it('should have empty inputs on initial rendering', () => {
      renderWithProvider(<RegisterScreen />);

      expect(screen.getByPlaceholderText('First name').props.value).toBe('');
      expect(screen.getByPlaceholderText('Last name').props.value).toBe('');
      expect(screen.getByPlaceholderText('Email').props.value).toBe('');
      expect(screen.getByPlaceholderText('Password').props.value).toBe('');
    });

    it.each(Object.values(TEST_DATA.erors))(
      'should not display "%s" on initial rendering', // %s === string
      error => {
        renderWithProvider(<RegisterScreen />);

        expect(screen.queryByText(error)).toBeNull();
      },
    );
  });

  describe('User Interaction', () => {
    it('should update firstName input when user types', () => {
      renderWithProvider(<RegisterScreen />);
      const firstNameInput = screen.getByPlaceholderText('First name');

      fireEvent.changeText(firstNameInput, 'Anas');

      expect(firstNameInput.props.value).toBe('Anas');
    });

    it('should update lastName input when user types', () => {
      renderWithProvider(<RegisterScreen />);
      const lastNameInput = screen.getByPlaceholderText('Last name');

      fireEvent.changeText(lastNameInput, 'Najar');

      expect(lastNameInput.props.value).toBe('Najar');
    });

    it('should update email input when user types', () => {
      renderWithProvider(<RegisterScreen />);
      const emailNameInput = screen.getByPlaceholderText('Email');

      fireEvent.changeText(emailNameInput, 'test@gmail.com');

      expect(emailNameInput.props.value).toBe('test@gmail.com');
    });

    it('should update password input when user types', () => {
      renderWithProvider(<RegisterScreen />);
      const passWordNameInput = screen.getByPlaceholderText('Password');

      fireEvent.changeText(passWordNameInput, 'Anas1234');

      expect(passWordNameInput.props.value).toBe('Anas1234');
    });

    it('should navigate to LoginScreen when footer link is pressed', () => {
      renderWithProvider(<RegisterScreen />);

      fireEvent.press(screen.getByText('Already have an account? Login In'));
      expect(navigate).toHaveBeenCalledTimes(1);
      expect(navigate).toHaveBeenCalledWith('LoginScreen');
    });
  });

  describe('Validation', () => {
    describe('email Validation', () => {
      it.each(TEST_DATA.invalidEmails)(
        'should show "$expectedError when email is "$value"',
        ({ expectedError, value }) => {
          renderWithProvider(<RegisterScreen />);

          const signUpButton = screen.getByTestId('Register');

          fireEvent.changeText(screen.getByPlaceholderText('Email'), value);
          fireEvent.press(signUpButton);

          expect(screen.getByText(expectedError)).toBeTruthy();
        },
      );

      it('sould accept valid email format', () => {
        renderWithProvider(<RegisterScreen />);

        const signUpButton = screen.getByTestId('Register');

        fireEvent.changeText(
          screen.getByPlaceholderText('Email'),
          TEST_DATA.validCredentials.email,
        );
        fireEvent.press(signUpButton);

        expect(screen.queryByText(TEST_DATA.erors.emptyEmail)).toBeNull();
        expect(screen.queryByText(TEST_DATA.erors.invalidEmail)).toBeNull();
      });
    });

    describe('passWord Validation', () => {
      it('should show Enter your password when password is invalid', () => {
        renderWithProvider(<RegisterScreen />);
        const passWordInput = screen.getByPlaceholderText('Password');
        const signUpButton = screen.getByTestId('Register');

        fireEvent.changeText(passWordInput, '');
        fireEvent.press(signUpButton);
        expect(screen.queryByText(TEST_DATA.erors.emptyPassWord)).toBeTruthy();
      });

      it('should accept valid password format', () => {
        renderWithProvider(<RegisterScreen />);
        const passWordInput = screen.getByPlaceholderText('Password');
        const signUpButton = screen.getByTestId('Register');

        fireEvent.changeText(passWordInput, '1234');
        fireEvent.press(signUpButton);
        expect(screen.queryByText(TEST_DATA.erors.emptyPassWord)).toBeNull();
      });
    });

    describe('firsName Validation', () => {
      it('should show Enter your your first name when firsName is invalid', () => {
        renderWithProvider(<RegisterScreen />);
        const firstNameInput = screen.getByPlaceholderText('First name');
        const signUpButton = screen.getByTestId('Register');

        fireEvent.changeText(firstNameInput, '');
        fireEvent.press(signUpButton);
        expect(screen.queryByText(TEST_DATA.erors.emptyFirstName)).toBeTruthy();
      });

      it('should accept valid first name format', () => {
        renderWithProvider(<RegisterScreen />);
        const firstNameInput = screen.getByPlaceholderText('First name');
        const signUpButton = screen.getByTestId('Register');

        fireEvent.changeText(firstNameInput, 'anas');
        fireEvent.press(signUpButton);
        expect(screen.queryByText(TEST_DATA.erors.emptyFirstName)).toBeNull();
      });
    });

    describe('lastName Validation', () => {
      it('should show Enter your your first name when lastName is invalid', () => {
        renderWithProvider(<RegisterScreen />);
        const lastNameInput = screen.getByPlaceholderText('Last name');

        const signUpButton = screen.getByTestId('Register');

        fireEvent.changeText(lastNameInput, '');
        fireEvent.press(signUpButton);
        expect(screen.queryByText(TEST_DATA.erors.emptyLastName)).toBeTruthy();
      });

      it('should accept valid first name format', () => {
        renderWithProvider(<RegisterScreen />);
        const lastNameInput = screen.getByPlaceholderText('Last name');
        const signUpButton = screen.getByTestId('Register');

        fireEvent.changeText(lastNameInput, 'najar');
        fireEvent.press(signUpButton);
        expect(screen.queryByText(TEST_DATA.erors.emptyLastName)).toBeNull();
      });
    });

    describe('Error Cleaning', () => {
      it('should clear First name error when First name input is focused', () => {
        renderWithProvider(<RegisterScreen />);
        const firstNameInput = screen.getByPlaceholderText('First name');
        const signUpButton = screen.getByTestId('Register');

        fireEvent.changeText(firstNameInput, '');
        fireEvent.press(signUpButton);
        expect(screen.queryByText(TEST_DATA.erors.emptyFirstName)).toBeTruthy();

        fireEvent(firstNameInput, 'focus');
        expect(screen.queryByText(TEST_DATA.erors.emptyFirstName)).toBeNull();
      });

      it('should clear Last name error when last name input is focused', () => {
        renderWithProvider(<RegisterScreen />);
        const LastNameInput = screen.getByPlaceholderText('Last name');
        const signUpButton = screen.getByTestId('Register');

        fireEvent.changeText(LastNameInput, '');
        fireEvent.press(signUpButton);
        expect(screen.queryByText(TEST_DATA.erors.emptyLastName)).toBeTruthy();

        fireEvent(LastNameInput, 'focus');
        expect(screen.queryByText(TEST_DATA.erors.emptyLastName)).toBeNull();
      });

      it('should clear email error when email input is focused', () => {
        renderWithProvider(<RegisterScreen />);
        const emailInput = screen.getByPlaceholderText('Email');
        const signUpButton = screen.getByTestId('Register');

        fireEvent.changeText(emailInput, '');
        fireEvent.press(signUpButton);
        expect(screen.queryByText(TEST_DATA.erors.emptyEmail)).toBeTruthy();

        fireEvent(emailInput, 'focus');
        expect(screen.queryByText(TEST_DATA.erors.emptyEmail)).toBeNull();
      });

      it('should clear passWord error when passWord input is focused', () => {
        renderWithProvider(<RegisterScreen />);
        const LastNameInput = screen.getByPlaceholderText('Password');
        const signUpButton = screen.getByTestId('Register');

        fireEvent.changeText(LastNameInput, '');
        fireEvent.press(signUpButton);
        expect(screen.queryByText(TEST_DATA.erors.emptyPassWord)).toBeTruthy();

        fireEvent(LastNameInput, 'focus');
        expect(screen.queryByText(TEST_DATA.erors.emptyPassWord)).toBeNull();
      });
    });
  });
});
it;
