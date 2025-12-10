import { fireEvent, render, screen } from '@testing-library/react-native';
import { FeComponentTransfer } from 'react-native-svg';
import FooterTextTouchable from '../../../src/components/ui/FooterTextTouchable';

describe('FooterTextTouchable', () => {
  it('should text render with the text', () => {
    render(<FooterTextTouchable onPress={() => {}} text="test-text" />);
    expect(screen.getByText('test-text')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const mockBtn = jest.fn();
    render(<FooterTextTouchable onPress={mockBtn} text="test-text" />);
    fireEvent.press(screen.getByTestId('footer-button'));
    expect(mockBtn).toHaveBeenCalledTimes(1);
  });
});
