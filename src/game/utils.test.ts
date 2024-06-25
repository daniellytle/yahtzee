import { diceRoll } from './utils';

describe('utils', () => {
  test('should return with a value of 1 - 6', () => {
    const value = diceRoll()
    expect([1,2,3,4,5,6].includes(value)).toBeTruthy();
  });
});