import { Player } from "./player"
import { PlayerResponse } from "./playerResponse"
import Scoring from "./scoring"
import { diceRoll, getFreshDice } from "./utils"

export class Runner {
  static parseResponse = () => {}

  static play = (player: Player, verbose: boolean = false): {[key: string]: number} => {
    const scores: { [key: string]: number } = {}
    while (!Scoring.scorables.every((scorable: string) => scorable in scores)) {
      let rollsRemaining = 2
      let dice = getFreshDice()
      if (verbose) console.log(`New Round: Dice are ${dice.join(" ")}`)
      while (rollsRemaining >= 0) {
        let response: PlayerResponse = player.playRound(
          rollsRemaining,
          dice,
          scores
        )
        if (response.scoreKey) {
          scores[response.scoreKey] = Scoring.scorableRules[response.scoreKey](dice)
          if (verbose) console.log(`Player scores dice ${dice.join(" ")} in ${response.scoreKey} for ${Scoring.scorableRules[response.scoreKey](dice)}`)
          break
        } else {
          if (rollsRemaining === 0) {
            throw "You have no more rolls"
          }
          if (response.diceIndeces) {
            const indeces = response.diceIndeces
            dice = dice.map((die, index) =>
              indeces.has(index) ? die : diceRoll()
            )
            if (verbose) console.log(`Player ReRolls dice indeces ${Array.from(indeces)}`)
            rollsRemaining -= 1
          }
        }
        if (verbose) console.log(`Dice: ${dice.join(" ")}`)
      }
    }
    return scores
  }
}
