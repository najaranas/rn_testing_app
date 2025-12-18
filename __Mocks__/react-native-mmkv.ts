export const mockSet = jest.fn();
export const mockGetString = jest.fn();
export const mockDekete = jest.fn();

export class MMKV {
  set = mockSet;
  getString = mockGetString;
  delete = mockDekete;
  constructor() {}
}
