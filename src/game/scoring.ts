import { count } from "console"

export default class Scoring {

  static countingScorables: string[] = [
    "Ones",
    "Twos",
    "Threes",
    "Fours",
    "Fives",
    "Sixes",
  ]

  static complexScorables: string[] = [
    "Three of a kind",
    "Four of a kind",
    "Full House",
    "Small Straight",
    "Large Straight",
    "Chance",
    "Yahtzee",
  ]

  static scorables: string[] = [
    ...Scoring.countingScorables,
    ...Scoring.complexScorables
  ]

  static countScore = (values: number[], targetValue: number) => {
    return values.filter((val) => val == targetValue).length * targetValue
  }

  static getCountingSum = (scores: {[key: string]: number}) => {
    return Scoring.sum(Scoring.countingScorables.map((scorable) => scores[scorable] || 0))
  }

  static getBonus = (scores: {[key: string]: number}) => {
    return Scoring.getCountingSum(scores) > 62 ? 35 : 0
  }

  static getTotalScore = (scores: {[key: string]: number}) => {
    return Scoring.sum(Object.values(scores)) + this.getBonus(scores)
  }

  static sum = (values: number[]) => {
    return values.reduce((agg, curr) => agg + curr, 0)
  }

  static gameIsComplete = (scores: {[key: string]: number}) => {
    return Object.keys(scores).length == this.scorables.length
  }

  static instancesOf = (values: number[], value: number): number => {
    const countHash: { [key: number]: number } = {}
    const countKeyHash: { [key: number]: number } = {}
    values.forEach((v) => {
      countHash[v] = v in countHash ? countHash[v] + 1 : 1
    })
    values.forEach((v) => {
      countKeyHash[countHash[v]] = v
    })
    return value in countKeyHash ? countKeyHash[value] : 0
  }

  static scorableRules: {
    [x: string]: (values: number[]) => number
  } = {
    Ones: (values: number[]): number => {
      return this.countScore(values, 1)
    },
    Twos: (values: number[]): number => {
      return this.countScore(values, 2)
    },
    Threes: (values: number[]): number => {
      return this.countScore(values, 3)
    },
    Fours: (values: number[]): number => {
      return this.countScore(values, 4)
    },
    Fives: (values: number[]): number => {
      return this.countScore(values, 5)
    },
    Sixes: (values: number[]): number => {
      return this.countScore(values, 6)
    },
    "Three of a kind": (values: number[]): number => {
      if (this.instancesOf(values, 3) || this.instancesOf(values, 4) || this.instancesOf(values, 5)) {
        return this.sum(values)
      } else {
        return 0
      }
    },
    "Four of a kind": (values: number[]): number => {
      if (this.instancesOf(values, 4) || this.instancesOf(values, 5)) {
        return this.sum(values)
      } else {
        return 0
      }
    },
    "Full House": (values: number[]): number => {
      if (this.instancesOf(values, 3) > 0 && this.instancesOf(values, 2) > 0) {
        return 25
      } else {
        return 0
      }
    },
    "Small Straight": (values: number[]): number => {
      const valueSet = new Set(values)
      if (valueSet.size >= 4) {
        const valueStr = Array.from(valueSet).sort().join("")
        if (["1234", "2345", "3456"].some((str) => valueStr.includes(str))) {
          return 35
        }
      }
      return 0
    },
    "Large Straight": (values: number[]): number => {
      const valueSet = new Set(values)
      if (valueSet.size === 5 && (!valueSet.has(1) || !valueSet.has(6))) {
        return 40
      } else {
        return 0
      }
    },
    Chance: (values: number[]): number => {
      return values.reduce((agg, curr) => agg + curr, 0)
    },
    Yahtzee: (values: number[]): number => {
      return new Set(values).size == 1 ? 50 : 0
    },
  }
}
