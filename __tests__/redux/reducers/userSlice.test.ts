import {
  loginUser,
  registerUser,
  selectUser,
  setUser,
} from '../../../src/redux/reducers/userSlice';
import { store } from '../../../src/redux/store';

const TEST_DATA = {
  validData: { firstName: 'anas', email: 'test@gmail.com', password: '1234' },
  invalidData: { firstName: '', email: '', password: '' },
};

describe('userSlice', () => {
  beforeEach(() => {
    store.dispatch(setUser(null as any));
  });

  it('should handle initial state', () => {
    const state = store.getState();
    expect(selectUser(state)).toBeNull();
  });

  it('should handle set User', () => {
    store.dispatch(setUser(TEST_DATA.validData));
    const state = store.getState();
    expect(selectUser(state)).toEqual(TEST_DATA.validData);
  });

  describe('registerUser', () => {
    it('should handle succesuful registration with real store', async () => {
      const action = await store.dispatch(registerUser(TEST_DATA.validData));
      const state = store.getState();

      expect(selectUser(state)).toEqual(TEST_DATA.validData);
      expect(action.type).toBe(registerUser.fulfilled.type);
    });

    it('should handle rejected registration with real store', async () => {
      const action = await store.dispatch(registerUser(TEST_DATA.invalidData));
      const state = store.getState();

      expect(selectUser(state)).toBeNull();
      expect(action.type).toBe(registerUser.rejected.type);
    });
  });

  describe('loginUser', () => {
    it('should handle succesuful login with real store', async () => {
      const action = await store.dispatch(loginUser(TEST_DATA.validData));
      const state = store.getState();

      expect(selectUser(state)).toEqual(TEST_DATA.validData);
      expect(action.type).toBe(loginUser.fulfilled.type);
    });

    it('should handle rejected login with real store', async () => {
      const action = await store.dispatch(loginUser(TEST_DATA.invalidData));
      const state = store.getState();

      expect(selectUser(state)).toBeNull();
      expect(action.type).toBe(loginUser.rejected.type);
    });
  });
});
