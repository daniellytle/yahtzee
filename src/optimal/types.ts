export type Widget = {
  expectedScore: number
  firstKeepSetMap?: any
  secondKeepSetMap?: any
  scoreActionMap?: any
}

export type Bit = 1 | 0

export type Roll = [number, number, number, number, number, number]
export type KeepSet = [number, number, number, number, number, number]

export type GameState = {
  topSum: number
  scoredCategories: Bit[]
  yahtzeeBonusFlag: Bit
}

export enum SCORE_CATEGORY {
  Ones = 0,
  Twos = 1,
  Threes = 2,
  Fours = 3,
  Fives = 4,
  Sixes = 5,
  ThreeOfAKind = 6,
  FourOfAKind = 7,
  FullHouse = 8,
  SmallStraight = 9,
  LargeStraight = 10,
  Chance = 11,
  Yahtzee = 12,
}

export type ExpectedValueMap = {
  [key: string]: number
}
