import { Player } from "../player"
import { PlayerResponse } from "../playerResponse"
import gameStateEVs from "../../optimal/gameStateEVs.json"
import { buildWidgetForGameState, encodeGameState } from "../../optimal/methods"
import Scoring from "../scoring"
import { GameState, Widget } from "../../optimal/types"

export class OptimalPlayer extends Player {
  gameStateEVMap: { [key: string]: number }

  constructor() {
    super()
    this.gameStateEVMap = gameStateEVs as { [key: string]: number }
  }

  playRound(
    rollsRemaining: number,
    dice: number[],
    scores: { [key: string]: number }
  ): PlayerResponse {
    // Get Game State
    const diceMap = dice.reduce((acc: { [key: string]: number }, die) => {
      acc[die - 1] = acc[die - 1] ? acc[die - 1] + 1 : 1
      return acc
    }, {})
    const roll: number[] = [0, 0, 0, 0, 0, 0].map((_, index) => {
      return diceMap[index] ? diceMap[index] : 0
    })
    const topSum: number = Scoring.getCountingSum(scores)
    const scoredCategories = Scoring.scorableTitleIndex().map((scorable) =>
      scorable in scores ? 1 : 0
    )
    const gameState: GameState = {
      topSum,
      scoredCategories,
    }
    const gameStateString = encodeGameState(gameState)

    // Build widget
    const widget: Widget = buildWidgetForGameState(
      gameStateString,
      this.gameStateEVMap
    )

    if (
      widget.expectedScore &&
      widget.firstKeepSetMap &&
      widget.secondKeepSetMap &&
      widget.scoreActionMap
    ) {
      const firstKeepSet = widget.firstKeepSetMap[JSON.stringify(roll)]
      const secondKeepSet = widget.secondKeepSetMap[JSON.stringify(roll)]
      const scoreAction = widget.scoreActionMap[JSON.stringify(roll)]

      if (
        firstKeepSet.keepSet.reduce((acc, count) => acc + count, 0) === 5 ||
        secondKeepSet.keepSet.reduce((acc, count) => acc + count, 0) === 5
      ) {
        return { scoreKey: Scoring.scorableTitleIndex()[scoreAction.category] }
      } else if (rollsRemaining > 0 && widget.firstKeepSetMap) {
        if (rollsRemaining === 2) {
          const keptIndices = new Set<number>()
          dice.forEach((die, index) => {
            if (firstKeepSet.keepSet[die - 1] > 0) {
              keptIndices.add(index)
              firstKeepSet.keepSet[die - 1] -= 1
            }
          })
          return {
            diceIndeces: keptIndices,
          }
        } else {
          const keptIndices = new Set<number>()
          dice.forEach((die, index) => {
            if (secondKeepSet.keepSet[die - 1] > 0) {
              keptIndices.add(index)
              secondKeepSet.keepSet[die - 1] -= 1
            }
          })
          return {
            diceIndeces: keptIndices,
          }
        }
      } else {
        return { scoreKey: Scoring.scorableTitleIndex()[scoreAction.category] }
      }
    }
    throw `schouldn't be here: ${gameStateString}`
    return { scoreKey: "Wah" }
  }
}
