import { fireEvent, render, screen } from '@testing-library/react-native';
import OnBoardingScreen from '../../src/screens/OnboardingScreen';
import { navigate } from '../../src/utils/NavigationUtil';

jest.mock('../../src/utils/NavigationUtil', () => ({
  navigate: jest.fn(),
}));

describe('OnboardingScreen', () => {
  it('should navigate correctly', () => {
    render(<OnBoardingScreen />);
    fireEvent.press(screen.getByText('Login'));
    expect(navigate).toHaveBeenCalledWith('LoginScreen');

    fireEvent.press(screen.getByText('Sign up'));
    expect(navigate).toHaveBeenCalledWith('RegisterScreen');
  });

  it('should call scrollBy(1) when Next button is pressed in the first slide', () => {
    render(<OnBoardingScreen />);

    const nextButtons = screen.getAllByText('Next');

    expect(nextButtons).toHaveLength(2);
    fireEvent.press(nextButtons[0]);
  });
});
