import { render, fireEvent, screen } from '@testing-library/react-native';
import CustomHeading from '../../../src/components/global/CustomHeading';
import { goBack } from '../../../src/utils/NavigationUtil';

jest.mock('../../../src/utils/NavigationUtil', () => ({
  goBack: jest.fn(),
}));

describe('CustomHeading', () => {
  const title = 'hello-test';

  beforeEach(() => {
    // Clear any previous mock calls
    jest.clearAllMocks();
  });

  it('should renders the title correctly', () => {
    render(<CustomHeading title={title} />);

    expect(screen.getByText(title)).toBeTruthy();
  });

  it('should calls goBack when back button is pressed', () => {
    render(<CustomHeading title={title} />);

    const backButton = screen.getByTestId('back-button');

    fireEvent.press(backButton);

    expect(goBack).toHaveBeenCalledTimes(1);
  });
});
