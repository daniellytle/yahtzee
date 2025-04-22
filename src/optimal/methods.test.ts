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
  buildWidgetForGameState,
  getScoreForRollInCategory,
  isGameStatePossible,
  isFinalGameState,
} from "./methods"
import { GameState, Roll } from "./types"

describe("methods", () => {
  describe("isGameStatePossible", () => {
    it("returns false for a state where yahtzee is scored and the bonus is 1", () => {
      const gameState: GameState = {
        topSum: 0,
        scoredCategories: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        yahtzeeBonusFlag: 0,
      }
      expect(isGameStatePossible(gameState)).toBe(false)
    })
  })

  describe("isFinalGameState", () => {
    it("detects a non-final game state", () => {
      const gameState: GameState = {
        topSum: 0,
        scoredCategories: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        yahtzeeBonusFlag: 0,
      }
      expect(isFinalGameState(gameState)).toBe(false)
    })

    it("detects a game state that is final", () => {
      const gameState: GameState = {
        topSum: 0,
        scoredCategories: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        yahtzeeBonusFlag: 1,
      }
      expect(isFinalGameState(gameState)).toBe(true)
    })
  })

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

  describe("getScoreForRollInCategory", () => {
    it("calculates yahtzee score", () => {
      const roll: Roll = [0, 5, 0, 0, 0, 0]
      expect(getScoreForRollInCategory(roll, 12, 0)).toBe(50)
    })

    it("calculates bonus yahtzee score", () => {
      const roll: Roll = [0, 5, 0, 0, 0, 0]
      expect(getScoreForRollInCategory(roll, 12, 0)).toBe(50)
      expect(getScoreForRollInCategory(roll, 4, 1)).toBe(100)
    })
  })

  getScoreForRollInCategory

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
        scoredCategories: [1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
        yahtzeeBonusFlag: 1,
      }
      const nextGameState = getStateAfterScoring(gameState, 3, 18)
      expect(nextGameState.topSum).toBe(32)
    })
  })

  describe("getUnscoredCategories", () => {
    it("returns the indeces of false score categories", () => {
      const gameState: GameState = {
        topSum: 14,
        scoredCategories: [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
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
      expect(outcomeProbabilities).toEqual({
        "[0,1,2,1,1,0]": 1,
      })
    })

    it("returns 1 possible outcome when all dice are kept", () => {
      const outcomeProbabilities = getOutcomeProbabilitiesFromKeepSet([
        0, 0, 0, 0, 0, 0,
      ])
      // expect(Object.keys(outcomeProbabilities).length).toBe(1)
      expect(outcomeProbabilities["[5,0,0,0,0,0]"]).toEqual(1)
    })

    it("returns 6 possible outcomes when 4 dice are kept", () => {
      const outcomeProbabilities = getOutcomeProbabilitiesFromKeepSet([
        0, 0, 2, 1, 1, 0,
      ])
      expect(Object.keys(outcomeProbabilities).length).toEqual(6)
      expect(outcomeProbabilities).toEqual({
        "[0,0,2,1,1,1]": 1,
        "[0,0,2,1,2,0]": 1,
        "[0,0,2,2,1,0]": 1,
        "[0,0,3,1,1,0]": 1,
        "[0,1,2,1,1,0]": 1,
        "[1,0,2,1,1,0]": 1,
      })
    })

    it("returns 21 possible outcomes when 3 dice are kept", () => {
      const outcomeProbabilities = getOutcomeProbabilitiesFromKeepSet([
        0, 0, 2, 0, 1, 0,
      ])
      expect(Object.keys(outcomeProbabilities).length).toEqual(21)
      // expect(outcomeProbabilities).toEqual({
      //   "[0,0,2,1,1,1]": 1,
      //   "[0,0,2,1,2,0]": 1,
      //   "[0,0,2,2,1,0]": 1,
      //   "[0,0,3,1,1,0]": 1,
      //   "[0,1,2,1,1,0]": 1,
      //   "[1,0,2,1,1,0]": 1,
      // })
    })

    it("returns 36 possible outcomes when 3 dice are kept", () => {
      expect(
        Object.keys(getOutcomeProbabilitiesFromKeepSet([0, 1, 1, 1, 0, 0]))
          .length
      ).toEqual(21)
    })

    it("returns X possible outcomes when generating outcomes for no kept dice", () => {
      const outcomeProbabilities = getOutcomeProbabilitiesFromKeepSet([
        0, 0, 0, 0, 0, 0,
      ])
      expect(Object.keys(outcomeProbabilities).length).toBe(252)
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

    it("returns all possible keepsets for a yahtzee", () => {
      const keepSets = getPossibleKeepSets([0, 0, 0, 0, 0, 5])
      expect(keepSets.length).toEqual(6)
      expect(keepSets).toEqual([
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 2],
        [0, 0, 0, 0, 0, 3],
        [0, 0, 0, 0, 0, 4],
        [0, 0, 0, 0, 0, 5],
      ])
    })
  })

  describe("buildWidgetForGameState", () => {
    it("builds the correct score action map for a game state", () => {
      const gameState: GameState = {
        topSum: 63,
        scoredCategories: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        yahtzeeBonusFlag: 0,
      }
      const mockEVMap = {
        "63-[1,1,1,1,1,1,1,1,1,1,1,1,1]-1": 35,
      }
      const widget = buildWidgetForGameState(gameState, mockEVMap)
      expect(widget.scoreActionMap["[0,5,0,0,0,0]"]).toEqual({
        EV: 85,
        category: 12,
      })
    })

    it("builds the correct widget for a game state", () => {
      const gameState: GameState = {
        topSum: 63,
        scoredCategories: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        yahtzeeBonusFlag: 0,
      }
      const mockEVMap = {
        "63-[1,1,1,1,1,1,1,1,1,1,1,1,1]-1": 35,
      }
      const widget = buildWidgetForGameState(gameState, mockEVMap)
      expect(widget.secondKeepSetMap["[0,5,0,0,0,0]"]).toEqual({
        EV: 85,
        keepSet: [0, 5, 0, 0, 0, 0],
      })
      expect(widget.firstKeepSetMap["[0,5,0,0,0,0]"]).toEqual({
        EV: 85,
        keepSet: [0, 5, 0, 0, 0, 0],
      })
    })

    it("builds the correct second reroll map for a game state", () => {
      const gameState: GameState = {
        topSum: 63,
        scoredCategories: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        yahtzeeBonusFlag: 0,
      }
      const mockEVMap = {
        "63-[1,1,1,1,1,1,1,1,1,1,1,1,1]-1": 35,
      }
      const widget = buildWidgetForGameState(gameState, mockEVMap)
      expect(widget.secondKeepSetMap["[1,4,0,0,0,0]"]).toEqual({
        EV: 43.333333333333336,
        keepSet: [0, 4, 0, 0, 0, 0],
      })
      expect(widget.firstKeepSetMap["[1,4,0,0,0,0]"]).toEqual({
        EV: 50.27777777777778,
        keepSet: [0, 4, 0, 0, 0, 0],
      })
    })
  })
})
