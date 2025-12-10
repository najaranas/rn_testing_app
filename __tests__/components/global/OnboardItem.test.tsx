import {fireEvent, render, screen} from '@testing-library/react-native';
import OnboardItem from '../../../src/components/global/OnboardItem';

describe('OnboardItem', () => {
  const mockOnPressFirst = jest.fn();
  const mockOnPressSecond = jest.fn();
  const defaultProps = {
    imageSource: 12,
    title: 'Welcome',
    subtitle: 'Get started with our app',
    buttonTitleFirst: 'Continue',
    onPressFirst: mockOnPressFirst,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('with one button', () => {
    it('should render all elements correctly', () => {
      render(<OnboardItem {...defaultProps} />);

      expect(screen.getByTestId('background-image')).toBeTruthy();
      expect(screen.getByText('Welcome')).toBeTruthy();
      expect(screen.getByText('Get started with our app')).toBeTruthy();
      expect(screen.getByText('Continue')).toBeTruthy();
    });

    it('should call onPressFirst when first button is pressed', () => {
      render(<OnboardItem {...defaultProps} />);

      const firstButton = screen.getByText('Continue');
      fireEvent.press(firstButton);

      expect(mockOnPressFirst).toHaveBeenCalledTimes(1);
    });

    it('should not render second button when not provided', () => {
      render(<OnboardItem {...defaultProps} />);

      expect(screen.queryByText('secondBtn')).toBeNull();
    });
  });

  describe('with two buttons', () => {
    const propsWithTwoButtons = {
      ...defaultProps,
      buttonTitleSecond: 'Skip',
      onPressSecond: mockOnPressSecond,
    };

    it('should render both buttons correctly', () => {
      render(<OnboardItem {...propsWithTwoButtons} />);

      expect(screen.getByText('Continue')).toBeTruthy();
      expect(screen.getByText('Skip')).toBeTruthy();
    });

    it('should call onPressSecond when second button is pressed', () => {
      render(<OnboardItem {...propsWithTwoButtons} />);

      const secondButton = screen.getByText('Skip');
      fireEvent.press(secondButton);

      expect(mockOnPressSecond).toHaveBeenCalledTimes(1);
    });

    it('should call correct handlers for each button', () => {
      render(<OnboardItem {...propsWithTwoButtons} />);

      fireEvent.press(screen.getByText('Continue'));
      fireEvent.press(screen.getByText('Skip'));

      expect(mockOnPressFirst).toHaveBeenCalledTimes(1);
      expect(mockOnPressSecond).toHaveBeenCalledTimes(1);
    });
  });
});
