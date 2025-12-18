import reduxStorage from '../../src/redux/storage';
import {
  mockSet,
  mockGetString,
  mockDekete,
} from '../../__Mocks__/react-native-mmkv';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('storage', () => {
  it('should call setItem with correct key and value', async () => {
    const key = 'theme';
    const value = 'light';

    const result = await reduxStorage.setItem(key, value);

    console.log('result', result);
    expect(mockSet).toHaveBeenCalledWith(key, value);
    expect(result).toBe(true);
  });

  it('should call getString with correct key', async () => {
    const key = 'theme';
    const value = 'light';
    mockGetString.mockReturnValue(value);
    const result = await reduxStorage.getItem(key);

    console.log('result', result);
    expect(mockGetString).toHaveBeenCalledWith(key);
    expect(result).toBe(value);
  });

  it('should call delete with correct key', async () => {
    const key = 'theme';
    const result = await reduxStorage.removeItem(key);

    console.log('result', result);
    expect(mockDekete).toHaveBeenCalledWith(key);
  });
});
