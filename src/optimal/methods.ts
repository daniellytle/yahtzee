import {
  SCORE_CATEGORY,
  Roll,
  ExpectedValueMap,
  Widget,
  Bit,
  GameState,
} from "./types"

const isFinalGameState = (gameState: GameState): boolean => {
  return gameState.scoredCategories.every((category) => category === 1)
}

export const encodeGameState = (gameState: GameState) => {
  const { topSum, scoredCategories, yahtzeeBonusFlag } = gameState
  return `${topSum}-${JSON.stringify(scoredCategories)}-${yahtzeeBonusFlag}`
}

export const decodeGameState = (str: string): GameState => {
  return {
    topSum: JSON.parse(str.split("-")[0]),
    scoredCategories: JSON.parse(str.split("-")[1]),
    yahtzeeBonusFlag: JSON.parse(str.split("-")[2]),
  }
}

export const getScoreForRollInCategory = (
  roll: Roll,
  category: SCORE_CATEGORY,
  yahtzeeBonusFlag: Bit
): number => {
  // returns the score for a roll in a category
  switch (category) {
    case SCORE_CATEGORY.Ones:
      return getCountScore(roll, 1)
    case SCORE_CATEGORY.Twos:
      return getCountScore(roll, 2)
    case SCORE_CATEGORY.Threes:
      return getCountScore(roll, 3)
    case SCORE_CATEGORY.Fours:
      return getCountScore(roll, 4)
    case SCORE_CATEGORY.Fives:
      return getCountScore(roll, 5)
    case SCORE_CATEGORY.Sixes:
      return getCountScore(roll, 6)
    case SCORE_CATEGORY.ThreeOfAKind:
      return getOfAKindScore(roll, 3)
    case SCORE_CATEGORY.FourOfAKind:
      return getOfAKindScore(roll, 4)
    case SCORE_CATEGORY.FullHouse:
      return getFullHouseScore(roll)
    case SCORE_CATEGORY.SmallStraight:
      return getSmallStraightScore(roll)
    case SCORE_CATEGORY.LargeStraight:
      return getLargeStraightScore(roll)
    case SCORE_CATEGORY.Chance:
      return getChanceScore(roll)
    case SCORE_CATEGORY.Yahtzee:
      return getYahtzeeScore(roll, yahtzeeBonusFlag)
  }
  return 0
}

export const getCountScore = (roll: Roll, dieNumber: number): number => {
  return roll[dieNumber - 1] * dieNumber
}

export const getOfAKindScore = (roll: Roll, ofAKindCount: number): number => {
  return roll.some((count) => count >= ofAKindCount)
    ? roll.reduce((a, b, index) => a + (b * index + 1))
    : 0
}

export const getFullHouseScore = (roll: Roll): number => {
  const counts = roll.filter((count) => count > 0)
  return counts.length === 2 && counts.some((count) => count === 3) ? 25 : 0
}

export const getSmallStraightScore = (roll: Roll): number => {
  const rollString = JSON.stringify(roll.map((a) => (a === 2 ? 1 : a)))
  const valid = rollString.includes("1,1,1,1")
  return valid ? 30 : 0
}

export const getLargeStraightScore = (roll: Roll): number => {
  const rollString = JSON.stringify(roll)
  const valid = rollString === "[1,1,1,1,1,0]" || rollString === "[0,1,1,1,1,1]"
  return valid ? 40 : 0
}

export const getChanceScore = (roll: Roll): number => {
  return roll.reduce((a, b, index) => a + (b * index + 1))
}

export const getYahtzeeScore = (roll: Roll, yahtzeeBonusFlag: Bit): number => {
  return roll.some((count) => count === 5)
    ? 50 + (yahtzeeBonusFlag ? 50 : 0)
    : 0
}

export const getAllPossibleGameStateStrings = (): string[] => {
  const possibleWidgets: string[] = []
  // scored categories
  for (let scoredCategories of getPossibleBitArrays(13).sort()) {
    // yahtzee bonus flag states
    for (let yahtzeeBonusFlag of [1, 0] satisfies Bit[]) {
      // top sum values
      for (let topSum = 0; topSum < 64; topSum++) {
        const gameState = {
          topSum,
          scoredCategories,
          yahtzeeBonusFlag,
        }
        if (isGameStatePossible(gameState)) {
          possibleWidgets.push(encodeGameState(gameState))
        }
      }
    }
  }
  return possibleWidgets.reverse()
}

export const getPossibleBitArrays = (length: number): Bit[][] => {
  const result: Bit[][] = []
  const totalCombinations = 1 << length // 2^length

  for (let i = 0; i < totalCombinations; i++) {
    const booleanArray: Bit[] = []
    for (let j = 0; j < length; j++) {
      // Check if the j-th bit in i is set
      booleanArray.push((i & (1 << j)) !== 0 ? 1 : 0)
    }
    result.push(booleanArray)
  }

  return result
}

export const canSumFromMultiples = (
  target: number,
  numbers: number[]
): boolean => {
  // Create a DP array to store whether a sum is achievable
  const dp: boolean[] = Array(target + 1).fill(false)
  dp[0] = true // Base case: 0 can always be achieved (by using no numbers)

  for (let num of numbers) {
    // Iterate forward to track how many times each number is used
    for (let count = 1; count <= 5; count++) {
      for (let sum = target; sum >= num; sum--) {
        if (dp[sum - num]) {
          dp[sum] = true
        }
      }
    }
  }

  return dp[target]
}

const isGameStatePossible = (gameState: GameState): boolean => {
  // Can the topsum number be achieved with the scored categories?
  const { topSum, scoredCategories } = gameState
  const scoredNumbers = scoredCategories
    .slice(0, 6)
    .map((scoredCategory, index) => (scoredCategory ? index + 1 : 0))
  return canSumFromMultiples(topSum, scoredNumbers)
}

export const getPossibleRolls = () => {
  const possibleRolls: Roll[] = []
  for (let ones = 0; ones < 6; ones++) {
    for (let twos = 0; twos < 6; twos++) {
      for (let threes = 0; threes < 6; threes++) {
        for (let fours = 0; fours < 6; fours++) {
          for (let fives = 0; fives < 6; fives++) {
            for (let sixes = 0; sixes < 6; sixes++) {
              if (ones + twos + threes + fours + fives + sixes != 5) {
                continue
              } else {
                possibleRolls.push([ones, twos, threes, fours, fives, sixes])
              }
            }
          }
        }
      }
    }
  }
  return possibleRolls
}

export const getPossibleKeepSets = (roll: Roll = [5, 5, 5, 5, 5, 5]) => {
  const possibleKeepSets: Roll[] = []
  for (let ones = 0; ones <= roll[0]; ones++) {
    for (let twos = 0; twos <= roll[1]; twos++) {
      for (let threes = 0; threes <= roll[2]; threes++) {
        for (let fours = 0; fours <= roll[3]; fours++) {
          for (let fives = 0; fives <= roll[4]; fives++) {
            for (let sixes = 0; sixes <= roll[5]; sixes++) {
              if (ones + twos + threes + fours + fives + sixes >= 6) {
                continue
              } else {
                possibleKeepSets.push([ones, twos, threes, fours, fives, sixes])
              }
            }
          }
        }
      }
    }
  }
  return possibleKeepSets
}

export const getOutcomeProbabilitiesFromKeepSet = (
  keepSet: Roll
): {
  [key: string]: {
    roll: Roll
    instances: number
  }
} => {
  const diceToRoll = 5 - keepSet.reduce((a, b) => a + b)
  const outcomes = Math.pow(6, diceToRoll)
  const outcomeProbabilites: {
    [key: string]: {
      roll: Roll
      instances: number
    }
  } = {}
  for (let i = 0; i < outcomes; i++) {
    const outcome: Roll = [0, 0, 0, 0, 0, 0]
    let temp = i
    for (let j = 0; j < diceToRoll; j++) {
      const dieValue = temp % 6
      outcome[dieValue] += 1
      temp = Math.floor(temp / 6)
    }
    // add the outcome to the map
    const outcomeRoll = mergeRolls(keepSet, outcome)
    const outcomeStr = JSON.stringify(outcomeRoll)
    outcomeProbabilites[outcomeStr] = {
      roll: outcomeRoll,
      instances:
        outcomeStr in outcomeProbabilites
          ? outcomeProbabilites[outcomeStr].instances + 1
          : 1,
    }
  }
  return outcomeProbabilites
}

export const mergeRolls = (roll1: Roll, roll2: Roll): Roll => {
  return roll1.map((value, index) => value + roll2[index]) as Roll
}

export const getStateAfterScoring = (
  gameState: GameState,
  scoreCategory: number
): GameState => {
  let { scoredCategories } = gameState
  scoredCategories[scoreCategory] = 1
  return {
    ...gameState,
    scoredCategories,
  }
}

export const getUnscoredCategories = (gameState: GameState): number[] => {
  return gameState.scoredCategories
    .map((scored, index) => {
      return {
        index,
        scored,
      }
    })
    .filter(({ scored }) => !scored)
    .map(({ index }) => index)
}

export const buildWidgetForGameState = (
  gameState: GameState,
  widgetMap: { [key: string]: number }
): Widget => {
  if (isFinalGameState(gameState)) {
    return {
      expectedScore: gameState.topSum >= 63 ? 35 : 0,
    }
  }
  // Step 1. Calc EV for final dice states and score categories
  const possibleRolls = getPossibleRolls()
  const possibleKeepSets = getPossibleRolls()
  const unscoredCategories = getUnscoredCategories(gameState)
  const ScoreActionEVMap: {
    [key: string]: {
      EV: number
      category: SCORE_CATEGORY
    }
  } = {}
  for (let roll of possibleRolls) {
    const scores = unscoredCategories.map(
      (category: number) =>
        getScoreForRollInCategory(roll, category, gameState.yahtzeeBonusFlag) +
        widgetMap[encodeGameState(getStateAfterScoring(gameState, category))]
    )
    const maxScoreEV = Math.max(...scores)
    const maxScoreCategory = unscoredCategories[scores.indexOf(maxScoreEV)]
    ScoreActionEVMap[JSON.stringify(roll)] = {
      EV: maxScoreEV,
      category: maxScoreCategory,
    }
  }
  // Step 2. Calc EV for last rerolls
  const SecondReRollEVMap: {
    [key: string]: number
  } = {}
  for (let keepSet of possibleKeepSets) {
    const outcomeProbabilites = getOutcomeProbabilitiesFromKeepSet(keepSet)
    const outcomeEVs = Object.keys(outcomeProbabilites).map((outcome) => {
      const scoreAction = ScoreActionEVMap[outcome]
      if (scoreAction) {
        return scoreAction.EV * outcomeProbabilites[outcome].instances
      }
      return 0
    })
    const avgOutcomeEV =
      outcomeEVs.reduce((a, b) => a + b, 0) / outcomeEVs.length
    SecondReRollEVMap[JSON.stringify(keepSet)] = avgOutcomeEV
  }

  // Step 3. Get optimal keepset for each possible outcome
  // for all possible outcomes find the keepset with the highest EV
  const secondKeepSetMap: {
    [key: string]: {
      keepSet: Roll
      EV: number
    }
  } = {}
  for (const roll of possibleRolls) {
    const keepSets = getPossibleKeepSets(roll)
    let maxEV: number = -1
    let maxKeepSet: Roll = keepSets[0]
    for (const keepSet of keepSets) {
      const keepSetStr = JSON.stringify(keepSet)
      const keepSetEV = SecondReRollEVMap[keepSetStr]
      if (keepSetEV > maxEV || maxEV === -1) {
        maxEV = keepSetEV
        maxKeepSet = keepSet
      }
    }
    secondKeepSetMap[JSON.stringify(roll)] = {
      keepSet: maxKeepSet,
      EV: maxEV,
    }
  }

  // Step 4. Calc EV for first rerolls
  const firstReRollEVMap: {
    [key: string]: number
  } = {}
  for (let keepSet of possibleKeepSets) {
    const outcomeProbabilites = getOutcomeProbabilitiesFromKeepSet(keepSet)
    const outcomeEVs = Object.keys(outcomeProbabilites).map((outcome) => {
      const optimalKeepSet = secondKeepSetMap[outcome]
      return (
        optimalKeepSet.EV *
        outcomeProbabilites[outcome].instances *
        (1 / outcomeProbabilites[outcome].instances)
      )
    })
    const avgOutcomeEV =
      outcomeEVs.reduce((a, b) => a + b, 0) / outcomeEVs.length
    firstReRollEVMap[JSON.stringify(keepSet)] = avgOutcomeEV
  }

  // Step 5. Get optimal keepset for each possible outcome
  const firstKeepSetMap: {
    [key: string]: {
      keepSet: Roll
      EV: number
    }
  } = {}
  for (const roll of possibleRolls) {
    const keepSets = getPossibleKeepSets(roll)
    let maxEV: number = -1
    let maxKeepSet: Roll = keepSets[0]
    for (const keepSet of keepSets) {
      const keepSetStr = JSON.stringify(keepSet)
      const keepSetEV = firstReRollEVMap[keepSetStr]
      if (keepSetEV > maxEV || maxEV === -1) {
        maxEV = keepSetEV
        maxKeepSet = keepSet
      }
    }
    firstKeepSetMap[JSON.stringify(roll)] = {
      keepSet: maxKeepSet,
      EV: maxEV,
    }
  }

  // Step 6. Get the EV for the whole widget
  const possibleOutcomesAndProbabilities = getOutcomeProbabilitiesFromKeepSet([
    0, 0, 0, 0, 0, 0,
  ])
  const outcomeCounts = Object.keys(possibleOutcomesAndProbabilities).length
  const outcomeEVs = Object.values(possibleOutcomesAndProbabilities).map(
    ({ roll, instances }) => {
      return firstKeepSetMap[JSON.stringify(roll)].EV * instances
    }
  )
  const totalAvgEV = outcomeEVs.reduce((a, b) => a + b, 0) / outcomeCounts

  // Return the widget data
  return {
    expectedScore: totalAvgEV,
    // firstKeepSetMap,
    // secondKeepSetMap,
  }
}
