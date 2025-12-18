export const mockSet = jest.fn();
export const mockGetString = jest.fn();
export const mockDelete = jest.fn();

export class MMKV {
  set = mockSet;
  getString = mockGetString;
  delete = mockDelete;
  constructor() {}
}
