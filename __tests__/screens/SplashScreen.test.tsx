import { render, screen, waitFor } from '@testing-library/react-native';
import SplashScreen from '../../src/screens/SplashScreen';
import {
  prepareNavigation,
  resetAndNavigate,
} from '../../src/utils/NavigationUtil';

// Mock the navigation functions
jest.mock('../../src/utils/NavigationUtil', () => ({
  prepareNavigation: jest.fn(),
  resetAndNavigate: jest.fn(),
}));

describe('SplashScreen', () => {
  describe('rendering', () => {
    it('should render activity indicator', () => {
      render(<SplashScreen />);
      expect(screen.getByTestId('loading-indicator')).toBeTruthy();
    });

    it('should render logo image', () => {
      render(<SplashScreen />);
      expect(screen.getByTestId('logo-image')).toBeTruthy();
    });
  });

  it('should call prepareNavigation on mount', () => {
    render(<SplashScreen />);

    expect(prepareNavigation).toHaveBeenCalled();
  });

  it('should rest & navigate after 3000ms', async () => {
    render(<SplashScreen />);

    await waitFor(
      () => {
        expect(resetAndNavigate).toHaveBeenCalled();
      },
      { timeout: 3500 }, //  Wait for slightly more than 3 seconds
    );
  });
});
