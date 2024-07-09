import { diceRoll, indecesOfMatching } from './utils';

describe('diceRoll', () => {
  test('should return with a value of 1 - 6', () => {
    const value = diceRoll()
    expect([1,2,3,4,5,6].includes(value)).toBeTruthy();
  });
});

describe('indecesOfMatching', () => {
  test('should return the correct indeces', () => {
    expect(indecesOfMatching(2, [1, 2, 3, 2, 1])).toEqual([1, 3]);
  });

  test('should return empty when there are no matches correct indeces', () => {
    expect(indecesOfMatching(4, [1, 2, 3, 2, 1])).toEqual([]);
  });
});