import {fireEvent, render, screen} from '@testing-library/react-native';
import CustomButton from '../../../src/components/ui/CustomButton';

describe('Custom Button', () => {
  const title = 'Test Button';
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with the title', () => {
    render(<CustomButton onPress={mockOnPress} title={title} />);
    expect(screen.getByText(title)).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    render(<CustomButton onPress={mockOnPress} title="Test" />);
    fireEvent.press(screen.getByTestId('custom-button'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('should render ActivityIndicator when loading', () => {
    render(<CustomButton onPress={mockOnPress} title="Test" loading />);
    expect(screen.getByTestId('activity-indicator')).toBeTruthy();
  });

  it('should disable btn when loading', () => {
    render(<CustomButton onPress={mockOnPress} title="Test" loading />);
    fireEvent.press(screen.getByTestId('custom-button'));
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('should apply custom background', () => {
    render(
      <CustomButton
        onPress={mockOnPress}
        title="Test"
        backgroundColor="#000"
      />,
    );
    expect(screen.getByTestId('custom-button')).toHaveStyle({
      backgroundColor: '#000',
    });
  });
});
