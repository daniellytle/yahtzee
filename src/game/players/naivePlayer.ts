import { Player } from "../player";
import { PlayerResponse } from "../playerResponse";
import Scoring from "../scoring";


/*
This player follows a naive strategy of looking at the dice after they are first rolled
and scoring the highest slot available.
*/
export class NaivePlayer extends Player {

  static maxScoreForDice = (dice: number[], scores: {[key: string]: number}): string => {
    const unscoredKeys = Scoring.scorables.filter((scorable) => !(scorable in scores))
    const possibleScores = unscoredKeys.map((key) => { return {"key": key, "value": Scoring.scorableRules[key](dice)}})
    return possibleScores.sort((a: {key: string, value: number}, b: {key: string, value: number}) => b.value - a.value)[0]["key"]
  }

  playRound(rollsRemaining: number, dice: number[], scores: {[key: string]: number}): PlayerResponse{
    // calculate highest and score
    const highestScoreKey = NaivePlayer.maxScoreForDice(dice, scores)
    return {scoreKey: highestScoreKey}
  }
}