import { Player } from "../player";
import { PlayerResponse } from "../playerResponse";
import Scoring from "../scoring";

/*
This player plays by calculating the expected values of each score slot given dice roll actions or scoring actions
and selecting the action with the highest expected value.
*/
export class SmartPlayer extends Player {

  static highestExpectedValue = (dice: number[], scores: {[key: string]: number}, rollsRemaining: number): string => {
    const unscoredKeys = Scoring.scorables.filter((scorable) => !(scorable in scores))
    const expectedValues = unscoredKeys.map((key) => { return {"key": key, "value": Scoring.scorableExpectedValue[key](dice, rollsRemaining)}})
    return expectedValues.sort((a: {key: string, value: number}, b: {key: string, value: number}) => b.value - a.value)[0]["key"]
  }

  playRound(rollsRemaining: number, dice: number[], scores: {[key: string]: number}): PlayerResponse {
    // calculate highest expected value for each slot based on each possible action.
    // possible actions include rolling any combination of 5 dice and scoring any 
    // of the remaining 13 slots
    const highestExpectedValueKey = SmartPlayer.highestExpectedValue(dice, scores, rollsRemaining)
    if (Scoring.countingScorables.includes(highestExpectedValueKey) && rollsRemaining > 0) {
      const diceIndeces = new Set(Scoring.scorableReRollStrategy[highestExpectedValueKey](dice))
      return {diceIndeces}
    } else {
      return {scoreKey: highestExpectedValueKey}
    }
  }
}