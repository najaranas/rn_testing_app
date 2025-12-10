import HomeScreen from '../../src/screens/HomeScreen';
import {render} from '@testing-library/react-native';

describe('home screen', () => {
  test('render home screen', () => {
    const homeScreen = render(<HomeScreen />);
    expect(homeScreen).toBeTruthy();
  });
});
