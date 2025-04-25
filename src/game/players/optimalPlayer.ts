import { Player } from "../player"
import { PlayerResponse } from "../playerResponse"

/*

*/
export class OptimalPlayer extends Player {
  playRound(
    rollsRemaining: number,
    dice: number[],
    scores: { [key: string]: number }
  ): PlayerResponse {
    // convert dice into a map

    // find our current game state

    // build the widget

    return { scoreKey: "ones" }
  }
}
