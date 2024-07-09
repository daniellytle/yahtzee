import { PlayerResponse } from "./playerResponse";

export interface PotentialAction {
  playerResponse: PlayerResponse,
  expectedScore: number
}