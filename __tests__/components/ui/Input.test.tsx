import { act, fireEvent, render, screen } from '@testing-library/react-native';
import Input from '../../../src/components/ui/Input';
import { Colors } from '../../../src/utils/Colors';

describe('Input Component', () => {
  const mockOnChangeText = jest.fn();
  const mockOnFocus = jest.fn();
  const mockOnBlur = jest.fn();

  const defaultProps = {
    value: '',
    onChangeText: mockOnChangeText,
    placeholder: 'Enter text',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Helper function to get styled component
  const getInputContainerStyle = () => {
    const container = screen.getByTestId('inputContainer');
    return container.props.style;
  };

  // ============================================================================
  // 1. RENDERING TESTS - Test what the user SEES
  // ============================================================================

  describe('Rendering', () => {
    it('should render all containers', () => {
      render(<Input {...defaultProps} />);

      expect(screen.getByTestId('animatedView')).toBeTruthy();
      expect(screen.getByTestId('inputContainer')).toBeTruthy();
      expect(screen.getByTestId('textInput')).toBeTruthy();
    });

    it('should render input with placeholder', () => {
      render(<Input {...defaultProps} />);

      expect(screen.getByPlaceholderText('Enter text')).toBeTruthy();
    });

    it('should render input with value', () => {
      render(<Input {...defaultProps} value="initial text" />);

      expect(screen.getByTestId('textInput').props.value).toBe('initial text');
    });

    it('should render error text when error exists', () => {
      render(<Input {...defaultProps} error={'Error text'} />);

      expect(screen.getByTestId('errorText')).toHaveTextContent('Error text');
    });

    it('should not render error text when error doesnt exists', () => {
      render(<Input {...defaultProps} />);

      expect(screen.queryByTestId('errorText')).toBeNull(); // return null if not found
    });
  });

  // ============================================================================
  // 2. INTERACTION TESTS - Test what the user CAN DO
  // ============================================================================

  describe('User Interactions', () => {
    it('should call onChangeText when user change text', () => {
      render(<Input {...defaultProps} />);
      fireEvent(screen.getByTestId('textInput'), 'changeText', 'hello');
      expect(mockOnChangeText).toHaveBeenCalledTimes(1);
      expect(mockOnChangeText).toHaveBeenCalledWith('hello');
    });

    it('should call onChangeText multiple times  when user change text', () => {
      render(<Input {...defaultProps} />);
      fireEvent(screen.getByTestId('textInput'), 'changeText', 'hello');
      fireEvent(screen.getByTestId('textInput'), 'changeText', 'hello anas');
      fireEvent(screen.getByTestId('textInput'), 'changeText', 'hello najar');
      expect(mockOnChangeText).toHaveBeenCalledTimes(3);
      expect(mockOnChangeText).toHaveBeenCalledWith('hello anas');
    });

    it('should call onFocus when input is focused', () => {
      render(<Input {...defaultProps} onFocus={mockOnFocus} />);
      fireEvent(screen.getByTestId('textInput'), 'focus');
      expect(mockOnFocus).toHaveBeenCalledTimes(1);
    });

    it('should call onBlur when input loses focus', () => {
      render(<Input {...defaultProps} onBlur={mockOnBlur} />);
      fireEvent(screen.getByTestId('textInput'), 'blur');
      expect(mockOnBlur).toHaveBeenCalledTimes(1);
    });
  });

  // ============================================================================
  // 3. STATE MANAGEMENT TESTS - Test internal state changes
  // ============================================================================

  describe('Focus State Management', () => {
    it('should apply input Container border style when focused', () => {
      render(<Input {...defaultProps} />);
      fireEvent(screen.getByTestId('textInput'), 'focus');

      expect(screen.getByTestId('inputContainer')).toHaveStyle({
        borderColor: Colors.primary,
        borderWidth: 2,
      });
    });

    it('should revert input Container border style when blurred', () => {
      render(<Input {...defaultProps} />);

      const input = screen.getByTestId('textInput');

      // Focus then blur
      fireEvent(input, 'focus');
      fireEvent(input, 'blur');

      expect(screen.getByTestId('inputContainer')).toHaveStyle({
        borderColor: Colors.disabled,
        borderWidth: 1,
      });
    });
  });

  // ============================================================================
  // 4. ERROR STATE TESTS - Test error handling
  // ============================================================================

  describe('Error State', () => {
    it('should show error border style when error exists', () => {
      render(<Input {...defaultProps} error="Error message" />);

      expect(screen.getByTestId('inputContainer')).toHaveStyle({
        borderColor: Colors.errorColor,
        borderWidth: 2,
      });
    });

    it('should prioritize error color over focus color', () => {
      render(<Input {...defaultProps} error="Error message" />);

      const input = screen.getByTestId('textInput');
      fireEvent(input, 'focus');

      expect(screen.getByTestId('inputContainer')).toHaveStyle({
        borderColor: Colors.errorColor,
        borderWidth: 2,
      });
    });

    it('should clear error border when error is removed', () => {
      const { rerender } = render(
        <Input {...defaultProps} error="Error message" />,
      );

      // Verify error state
      expect(screen.getByTestId('inputContainer')).toHaveStyle({
        borderColor: Colors.errorColor,
        borderWidth: 2,
      });

      // Remove error
      rerender(<Input {...defaultProps} error={null} />);
      expect(screen.getByTestId('inputContainer')).toHaveStyle({
        borderColor: Colors.disabled,
        borderWidth: 1,
      });
    });
  });

  // ============================================================================
  // 5. DISABLED STATE TESTS - Test disabled behavior
  // ============================================================================

  describe('Disabled State', () => {
    it('should make animated View pointerevents none when disabled', () => {
      render(<Input {...defaultProps} disabled />);

      expect(screen.getByTestId('animatedView')).toHaveStyle({
        pointerEvents: 'none',
      });
    });

    it('should make input not editable when disabled', () => {
      render(<Input {...defaultProps} disabled />);

      expect(screen.getByTestId('textInput').props.editable).toBe(false);
    });

    it('should not execute onFocus & onBlur & onChangeText when disabled', () => {
      render(
        <Input
          {...defaultProps}
          disabled
          onFocus={mockOnFocus}
          onBlur={mockOnBlur}
          onChangeText={mockOnChangeText}
        />,
      );

      const textInput = screen.getByTestId('textInput');

      fireEvent(textInput, 'focus');
      expect(mockOnFocus).not.toHaveBeenCalled();

      fireEvent(textInput, 'blur');
      expect(mockOnBlur).not.toHaveBeenCalled();

      fireEvent(textInput, 'changeText', 'text change');
      expect(mockOnChangeText).not.toHaveBeenCalled();
    });
  });
});
