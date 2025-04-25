import { useEffect, useState } from "react"
import { GameState, Roll, Widget } from "../optimal/types"
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

  const setRollContent = (roll: Roll): void => {
    console.log(roll)
    const die: number[] = []
    roll.forEach((count, index) => {
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
      </div>
    )
  }

  const setScoreContent = (category: number): void => {
    setMessage(
      <div className="flex flex-col space-y-2">
        <div className="flex flex-row space-x-2">
          <div>{`Score ${Scoring.scorableTitleIndex()[category]}`}</div>
        </div>
      </div>
    )
  }

  useEffect(() => {
    // Get EV Map
    const gameStateStrings = getAllPossibleGameStateStrings()
    const gameStateEVMap = gameStateStrings.reduce(
      (acc: { [key: string]: number }, gameStateString, index) => {
        const gameStateEV = (gameStateEVs as number[])[index]
        if (gameStateEV) {
          acc[gameStateString] = gameStateEV
        }
        return acc
      },
      {}
    )
    setGameStateEVMap(gameStateEVMap)
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

    if (
      widget.expectedScore &&
      widget.firstKeepSetMap &&
      widget.secondKeepSetMap &&
      widget.scoreActionMap
    ) {
      const firstReRoll = widget.firstKeepSetMap[JSON.stringify(roll)].keepSet
      const secondReRoll = widget.secondKeepSetMap[JSON.stringify(roll)].keepSet
      const scoreCategory = widget.scoreActionMap[JSON.stringify(roll)].category

      if (
        firstReRoll.reduce((acc, count) => acc + count, 0) === 5 ||
        secondReRoll.reduce((acc, count) => acc + count, 0) === 5
      ) {
        setScoreContent(scoreCategory)
      } else if (rollsRemaining > 0 && widget.firstKeepSetMap) {
        if (rollsRemaining === 2) {
          setRollContent(widget.firstKeepSetMap[JSON.stringify(roll)].keepSet)
        } else {
          setRollContent(widget.secondKeepSetMap[JSON.stringify(roll)].keepSet)
        }
      } else if (rollsRemaining === 0 && widget.scoreActionMap) {
        const category = widget.scoreActionMap[JSON.stringify(roll)].category
        setScoreContent(category)
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
