import { binomial, indecesOfMatching, sum } from "./utils"

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
    ...Scoring.complexScorables,
  ]

  static countScore = (values: number[], targetValue: number) => {
    return values.filter((val) => val === targetValue).length * targetValue
  }

  static getCountingSum = (scores: { [key: string]: number }) => {
    return sum(
      Scoring.countingScorables.map((scorable) => scores[scorable] || 0)
    )
  }

  static getBonus = (scores: { [key: string]: number }) => {
    return Scoring.getCountingSum(scores) > 62 ? 35 : 0
  }

  static getTotalScore = (scores: { [key: string]: number }) => {
    return sum(Object.values(scores)) + this.getBonus(scores)
  }

  static gameIsComplete = (scores: { [key: string]: number }) => {
    return Object.keys(scores).length === this.scorables.length
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
      if (
        this.instancesOf(values, 3) ||
        this.instancesOf(values, 4) ||
        this.instancesOf(values, 5)
      ) {
        return sum(values)
      } else {
        return 0
      }
    },
    "Four of a kind": (values: number[]): number => {
      if (this.instancesOf(values, 4) || this.instancesOf(values, 5)) {
        return sum(values)
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
      return new Set(values).size === 1 ? 50 : 0
    },
  }

  static sameDiceExpectedValue(differentDiceCount: number, rollsRemaining: number): number {
    const sameDiceCount = 5 - differentDiceCount
    if (rollsRemaining === 0) { return 5 - differentDiceCount }
    else if (rollsRemaining === 1) {
      return sameDiceCount + (differentDiceCount / 6)
    } else {
      let ev = 0
      let target = 0
      while (target <= differentDiceCount) {
        const probability = ((1.0 / 6.0)**target) * (5.0 / 6.0)**(differentDiceCount - target)
        const evOfLaterRoll = binomial(differentDiceCount, target) * probability * this.sameDiceExpectedValue(differentDiceCount - target, rollsRemaining - 1)
        ev += evOfLaterRoll
        target += 1
      }
      return ev
    }
  }

  static scorableExpectedValue: {
    [x: string]: (values: number[], rollsRemaining: number) => number
  } = {
    Ones: (values: number[], rollsRemaining: number): number => {
      return this.sameDiceExpectedValue(values.filter(x => x !== 1).length, rollsRemaining) * 1
    },
    Twos: (values: number[], rollsRemaining: number): number => {
      return this.sameDiceExpectedValue(values.filter(x => x !== 2).length, rollsRemaining) * 2
    },
    Threes: (values: number[], rollsRemaining: number): number => {
      return this.sameDiceExpectedValue(values.filter(x => x !== 3).length, rollsRemaining) * 3
    },
    Fours: (values: number[], rollsRemaining: number): number => {
      return this.sameDiceExpectedValue(values.filter(x => x !== 4).length, rollsRemaining) * 4
    },
    Fives: (values: number[], rollsRemaining: number): number => {
      return this.sameDiceExpectedValue(values.filter(x => x !== 5).length, rollsRemaining) * 5
    },
    Sixes: (values: number[], rollsRemaining: number): number => {
      return this.sameDiceExpectedValue(values.filter(x => x !== 6).length, rollsRemaining) * 6
    },
    "Three of a kind": (values: number[]): number => {
      if (
        this.instancesOf(values, 3) ||
        this.instancesOf(values, 4) ||
        this.instancesOf(values, 5)
      ) {
        return sum(values)
      } else {
        return 0
      }
    },
    "Four of a kind": (values: number[]): number => {
      if (this.instancesOf(values, 4) || this.instancesOf(values, 5)) {
        return sum(values)
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
      return new Set(values).size === 1 ? 50 : 0
    },
  }

  static scorableReRollStrategy: {[key: string]: (values: number[]) => number[]} = {
    Ones: (values: number[]) => indecesOfMatching(1, values),
    Twos: (values: number[]) => indecesOfMatching(2, values),
    Threes: (values: number[]) => indecesOfMatching(3, values),
    Fours: (values: number[]) => indecesOfMatching(4, values),
    Fives: (values: number[]) => indecesOfMatching(5, values),
    Sixes: (values: number[]) => indecesOfMatching(6, values),
    "Three of a kind": (values: number[]) => [], // reroll all but those that match
    "Four of a kind": (values: number[]) => [], // reroll all but those that match
    "Full House": (values: number[]) => [], // hold all matching up to three and including two
    "Small Straight": (values: number[]) => [], // reroll those not in the straight
    "Large Straight": (values: number[]) => [], // reroll those not in the straight
    Chance: (values: number[]) => [], // reroll dice lower than four
    Yahtzee: (values: number[]) => [], // reroll all but those that match
  }

  static scorableMaxValue: {[key: string]: number} = {
    Ones: 5,
    Twos: 10,
    Threes: 15,
    Fours: 20,
    Fives: 25,
    Sixes: 30,
    "Three of a kind": 30,
    "Four of a kind": 30,
    "Full House": 25,
    "Small Straight": 35,
    "Large Straight": 40,
    Chance: 30,
    Yahtzee: 50,
  }
}
