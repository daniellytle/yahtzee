import {
  canSumFromMultiples,
  decodeGameState,
  encodeGameState,
  getPossibleRolls,
  getPossibleBitArrays,
  getChanceScore,
  getCountScore,
  getFullHouseScore,
  getLargeStraightScore,
  getOfAKindScore,
  getSmallStraightScore,
  getStateAfterScoring,
  getUnscoredCategories,
  getPossibleKeepSets,
  getOutcomeProbabilitiesFromKeepSet,
} from "./methods"
import { GameState, Roll } from "./types"

describe("methods", () => {
  describe("getCountScore", () => {
    it("gets count score for twos", () => {
      const roll: Roll = [0, 3, 1, 1, 0, 0]
      expect(getCountScore(roll, 2)).toBe(6)
    })

    it("gets count score for twos", () => {
      const roll: Roll = [0, 0, 2, 0, 3, 0]
      expect(getCountScore(roll, 5)).toBe(15)
    })
  })

  describe("getOfAKindScore", () => {
    it("calculates three of a kind score", () => {
      const roll: Roll = [0, 3, 1, 1, 0, 0]
      expect(getOfAKindScore(roll, 3)).toBe(13)
    })

    it("calculates three of a kind score to be 0", () => {
      const roll: Roll = [0, 2, 1, 1, 1, 0]
      expect(getOfAKindScore(roll, 3)).toBe(0)
    })

    it("calculates four of a kind score", () => {
      const roll: Roll = [0, 1, 0, 4, 0, 0]
      expect(getOfAKindScore(roll, 4)).toBe(18)
    })

    it("calculates four of a kind score to be 0", () => {
      const roll: Roll = [0, 3, 1, 1, 0, 0]
      expect(getOfAKindScore(roll, 4)).toBe(0)
    })
  })

  describe("getFullHouseScore", () => {
    it("calculates full house score", () => {
      const roll: Roll = [0, 2, 3, 0, 0, 0]
      expect(getFullHouseScore(roll)).toBe(25)
    })
    it("calculates full house score to be 0", () => {
      const roll: Roll = [0, 2, 2, 1, 0, 0]
      expect(getFullHouseScore(roll)).toBe(0)
    })
  })

  describe("getSmallStraightScore", () => {
    it("calculates small straight score", () => {
      const roll: Roll = [0, 1, 1, 1, 2, 0]
      expect(getSmallStraightScore(roll)).toBe(30)
    })
    it("calculates small straight score from a large straight", () => {
      const roll: Roll = [0, 1, 1, 1, 1, 1]
      expect(getSmallStraightScore(roll)).toBe(30)
    })
    it("calculates small straight score to be 0", () => {
      const roll: Roll = [1, 1, 2, 0, 1, 0]
      expect(getSmallStraightScore(roll)).toBe(0)
    })
    it("calculates a different small straight score to be 0", () => {
      const roll: Roll = [1, 2, 2, 0, 0, 0]
      expect(getSmallStraightScore(roll)).toBe(0)
    })
  })

  describe("getLargeStraightScore", () => {
    it("calculates large straight score", () => {
      const roll: Roll = [0, 1, 1, 1, 1, 1]
      expect(getLargeStraightScore(roll)).toBe(40)
    })
    it("calculates large straight score to be 0", () => {
      const roll: Roll = [1, 0, 1, 1, 1, 1]
      expect(getLargeStraightScore(roll)).toBe(0)
    })
  })

  describe("getChangeScore", () => {
    it("calculates chance score", () => {
      const roll: Roll = [0, 1, 1, 1, 2, 0]
      expect(getChanceScore(roll)).toBe(19)
    })
  })

  describe("generatePossiblBitArrays", () => {
    it("generates boolean arrays of length 1", () => {
      const result = getPossibleBitArrays(1).sort()
      expect(result).toEqual([[0], [1]])
    })

    it("generates boolean arrays of length 2", () => {
      const result = getPossibleBitArrays(2).sort()
      expect(result).toEqual([
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
      ])
    })
  })

  describe("canSumFromMultiples", () => {
    it("determines if a sum can be made from the array of numbers", () => {
      // 3 + 3 + 3 = 9
      expect(canSumFromMultiples(15, [5, 3])).toBe(true)
      expect(canSumFromMultiples(9, [3])).toBe(true)
      // 3 + 3 + 3 + 3 + 3 = 15
      expect(canSumFromMultiples(15, [2, 3, 7])).toBe(true)
      // not enough dice
      expect(canSumFromMultiples(45, [1])).toBe(false)
      // 5 + 2 + 1
      expect(canSumFromMultiples(13, [1, 2, 5])).toBe(true)
      // not enough dice
      expect(canSumFromMultiples(35, [5])).toBe(false)
    })
  })

  describe("generateAllPossibleRolls", () => {
    it("generates the correct amount of possible rolls", () => {
      const allPossibleRolls = getPossibleRolls()
      expect(allPossibleRolls.length).toBe(252)
      expect(allPossibleRolls[89]).toEqual([0, 1, 3, 1, 0, 0])
    })
  })

  describe("encodeGameState", () => {
    it("encodes the gameState to a string", () => {
      const gameState: GameState = {
        topSum: 14,
        scoredCategories: [1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        yahtzeeBonusFlag: 1,
      }
      expect(encodeGameState(gameState)).toBe(
        "14-[1,0,1,0,1,1,1,0,0,0,0,0,0,0]-1"
      )
    })
  })

  describe("decodeGameState", () => {
    it("decodes a string to a gameState", () => {
      const gameStateString = "14-[1,0,1,0,1,1,1,0,0,0,0,0,0,0]-0"
      const { topSum, scoredCategories, yahtzeeBonusFlag } =
        decodeGameState(gameStateString)
      expect(topSum).toBe(14)
      expect(scoredCategories[1]).toBe(0)
      expect(yahtzeeBonusFlag).toBe(0)
    })
  })

  describe("getStateAfterScoring", () => {
    it("updates the scoredCategories array", () => {
      const gameState: GameState = {
        topSum: 14,
        scoredCategories: [1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        yahtzeeBonusFlag: 1,
      }
      expect(getStateAfterScoring(gameState, 3).scoredCategories[3]).toBe(1)
    })
  })

  describe("getUnscoredCategories", () => {
    it("returns the indeces of false score categories", () => {
      const gameState: GameState = {
        topSum: 14,
        scoredCategories: [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
        yahtzeeBonusFlag: 1,
      }
      expect(getUnscoredCategories(gameState)).toEqual([1, 3, 12])
    })
  })

  describe("getPossibleOutcomesFromKeepSet", () => {
    it("returns 1 possible outcome when all dice are kept", () => {
      const outcomeProbabilities = getOutcomeProbabilitiesFromKeepSet([
        0, 1, 2, 1, 1, 0,
      ])
      expect(Object.keys(outcomeProbabilities).length).toBe(1)
      expect(outcomeProbabilities["[0,1,2,1,1,0]"]).toEqual({
        roll: [0, 1, 2, 1, 1, 0],
        instances: 1,
      })
    })

    it("returns 6 possible outcomes when 5 dice are kept", () => {
      expect(
        Object.keys(getOutcomeProbabilitiesFromKeepSet([0, 0, 2, 1, 1, 0]))
          .length
      ).toEqual(6)
    })

    it("returns 36 possible outcomes when 3 dice are kept", () => {
      expect(
        Object.keys(getOutcomeProbabilitiesFromKeepSet([0, 1, 1, 1, 0, 0]))
          .length
      ).toEqual(21)
    })
  })

  describe("getPossibleKeepSets", () => {
    it("returns all possible keepsets", () => {
      expect(getPossibleKeepSets().length).toEqual(462)
    })

    it("returns all possible keepsets for a given roll", () => {
      expect(getPossibleKeepSets([0, 1, 2, 1, 1, 0]).length).toEqual(24)
    })

    it("returns all possible keepsets for a given roll", () => {
      expect(getPossibleKeepSets([0, 4, 1, 0, 0, 0]).length).toEqual(10)
    })
  })
})
