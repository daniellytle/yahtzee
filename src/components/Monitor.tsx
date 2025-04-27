import { useEffect, useState } from "react"
import { GameState, Roll, SCORE_CATEGORY, Widget } from "../optimal/types"
import Scoring from "../game/scoring"
import {
  buildWidgetForGameState,
  encodeGameState,
  getAllPossibleGameStateStrings,
} from "../optimal/methods"
import gameStateEVs from "../optimal/gameStateEVs.json"
import Die from "./Die"

type MonitorProps = {
  dice: number[]
  rollsRemaining: number
  scores: { [key: string]: number }
}

const Monitor = ({ dice, rollsRemaining, scores }: MonitorProps) => {
  const [gameStateEVMap, setGameStateEVMap] = useState<{
    [key: string]: number
  }>({})
  const [message, setMessage] = useState<JSX.Element>()

  const setRollContent = (keepSet: Roll, expectedScore: number): void => {
    const die: number[] = []
    keepSet.forEach((count, index) => {
      for (let i = 0; i < count; i++) {
        die.push(index + 1)
      }
    })
    setMessage(
      <div className="flex flex-col space-y-2">
        <div className="flex items-center flex-row space-x-4">
          <div>Keep</div>
          <div className="flex flex-row space-x-2">
            {die.map((die, index) => (
              <Die
                key={index}
                index={0}
                value={die}
                onSelect={() => {}}
                className="shadow-md bg-white transition-all lg:h-12 lg:w-12 rounded-xl relative flex content-center justify-center"
              />
            ))}
          </div>
        </div>
        <div className="flex items-center flex-row space-x-4">
          {`Expected Final Score: `}
          {expectedScore.toFixed(2)}
        </div>
      </div>
    )
  }

  const setScoreContent = (
    category: SCORE_CATEGORY,
    expectedScore: number
  ): void => {
    setMessage(
      <div className="flex flex-col space-y-2">
        <div>{`Score ${Scoring.scorableTitleIndex()[category]}`}</div>
        <div>{`Expected Final Score: ${expectedScore.toFixed(2)}`}</div>
      </div>
    )
  }

  useEffect(() => {
    // Get EV Map
    setGameStateEVMap(gameStateEVs as { [key: string]: number })
  }, [])

  useEffect(() => {
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
      yahtzeeBonusFlag: scoredCategories[12],
    }
    const gameStateString = encodeGameState(gameState)

    // Build widget
    const widget: Widget = buildWidgetForGameState(
      gameStateString,
      gameStateEVMap
    )

    const currentScore = Object.values(scores).reduce((a, b) => a + b, 0)

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
        setScoreContent(scoreAction.category, currentScore + scoreAction.EV)
      } else if (rollsRemaining > 0 && widget.firstKeepSetMap) {
        if (rollsRemaining === 2) {
          setRollContent(firstKeepSet.keepSet, firstKeepSet.EV + currentScore)
        } else {
          setRollContent(secondKeepSet.keepSet, secondKeepSet.EV + currentScore)
        }
      } else if (rollsRemaining === 0 && widget.scoreActionMap) {
        setScoreContent(scoreAction.category, currentScore + scoreAction.EV)
      }
    }
  }, [dice, rollsRemaining, scores])

  return (
    <div className="flex justify-center text-2xl">
      <div>{message}</div>
    </div>
  )
}

export default Monitor
