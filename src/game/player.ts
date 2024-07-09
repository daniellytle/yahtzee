import { PlayerResponse } from "./playerResponse";

export class Player {
  playRound(rollsRemaining: number, dice: number[], scores: {[key: string]: number}): PlayerResponse {
    // Implement
    return { diceIndeces: new Set() }
  }
}