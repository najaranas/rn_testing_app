import { CommonActions, StackActions } from '@react-navigation/native';
import {
  goBack,
  navigate,
  push,
  resetAndNavigate,
} from '../../src/utils/NavigationUtil';

jest.mock('@react-navigation/native', () => ({
  createNavigationContainerRef: jest.fn(() => ({
    dispatch: jest.fn(),
    isReady: jest.fn(),
  })),
  CommonActions: {
    navigate: jest.fn(),
    goBack: jest.fn(),
    reset: jest.fn(),
  },
  StackActions: {
    push: jest.fn(),
  },
}));

describe('NavigationUtil', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('navigate', () => {
    it('should navigate to route name', async () => {
      await navigate('TestRoute');

      expect(CommonActions.navigate).toHaveBeenCalledWith(
        'TestRoute',
        undefined,
      );
    });

    it('should navigate to route name with params', async () => {
      await navigate('TestRoute', { id: 14 });

      expect(CommonActions.navigate).toHaveBeenCalledWith('TestRoute', {
        id: 14,
      });
    });
  });

  describe('goBack', () => {
    it('should goBack ', async () => {
      await goBack();

      expect(CommonActions.goBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('resetAndNavigate', () => {
    it('should reset and navigate ', async () => {
      await resetAndNavigate('testRoute');

      expect(CommonActions.reset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: 'testRoute' }],
      });
    });
  });

  describe('push', () => {
    it('should push to route name', async () => {
      await push('TestRoute');

      expect(StackActions.push).toHaveBeenCalledWith('TestRoute', undefined);
    });

    it('should push to route name with params', async () => {
      await push('TestRoute', { id: 14 });

      expect(StackActions.push).toHaveBeenCalledWith('TestRoute', {
        id: 14,
      });
    });
  });
});
