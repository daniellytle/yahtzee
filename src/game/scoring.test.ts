import Scoring from './scoring';

describe('scorableRules', () => {
  test('Ones counts ones', () => {
    expect(Scoring.scorableRules["Ones"]([1,2,1,1,1])).toBe(4)
  });

  test('Full House counts full house', () => {
    expect(Scoring.scorableRules["Full House"]([3,3,3,1,1])).toBe(25)
  });

  test('Three of a kind counts dice', () => {
    expect(Scoring.scorableRules["Three of a kind"]([3,3,3,3,1])).toBe(13)
  });
});

describe('getTotalScore', () => {
  test('', () => {
    expect(Scoring.scorableRules["Ones"]([1,2,1,1,1])).toBe(4)
  });

  test('Full House', () => {
    expect(Scoring.scorableRules["Full House"]([3,3,3,1,1])).toBe(25)
  });

  test('Three of a kind', () => {
    expect(Scoring.scorableRules["Three of a kind"]([3,3,3,3,1])).toBe(13)
  });
});