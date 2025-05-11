import { ReactNode, useEffect, useMemo, useState } from "react"
import { GameState, Roll, SCORE_CATEGORY, Widget } from "../optimal/types"
import Scoring from "../game/scoring"
import { buildWidgetForGameState, encodeGameState } from "../optimal/methods"
import Die from "./Die"
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react"

type MonitorProps = {
  selectedDice: Set<number>
  dice: number[]
  rollsRemaining: number
  scores: { [key: string]: number }
}

const Monitor = ({
  selectedDice,
  dice,
  rollsRemaining,
  scores,
}: MonitorProps) => {
  const [gameStateEVMap, setGameStateEVMap] = useState<{
    [key: string]: number
  }>({})
  const [isLoadingEVMap, setIsLoadingEVMAP] = useState(true)
  const [selectedAssistantIndex, setSelectedAssistantIndex] = useState(0)

  const getRollContent = (keepSet: Roll, expectedScore: number): ReactNode => {
    const die: number[] = []
    keepSet.forEach((count, index) => {
      for (let i = 0; i < count; i++) {
        die.push(index + 1)
      }
    })
    return (
      <div className="flex flex-col space-y-2">
        <div className="flex items-center flex-row space-x-4">
          {die.length === 0 ? (
            <>Re-roll all dice</>
          ) : (
            <>
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
            </>
          )}
        </div>
        <div>{`Expected Score: ${expectedScore.toFixed(2)}`}</div>
      </div>
    )
  }

  const getScoreContent = (
    category: SCORE_CATEGORY,
    expectedScore: number
  ): ReactNode => {
    return (
      <div className="flex flex-col space-y-2">
        <div>{`Score ${Scoring.scorableTitleIndex()[category]}`}</div>
        <div>{`Expected Final Score: ${expectedScore.toFixed(2)}`}</div>
      </div>
    )
  }

  useEffect(() => {
    // Load game state EV map
    const fetchGameStateEVMap = async () => {
      const response = await fetch("/yahtzee/gameStateEVs.json")
      const data = await response.json()
      setGameStateEVMap(data)
      setIsLoadingEVMAP(false)
    }
    fetchGameStateEVMap()
  }, [])

  const actionMessage = useMemo(() => {
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
        return getScoreContent(
          scoreAction.category,
          currentScore + scoreAction.EV
        )
      } else if (rollsRemaining > 0 && widget.firstKeepSetMap) {
        if (rollsRemaining === 2) {
          return getRollContent(
            firstKeepSet.keepSet,
            firstKeepSet.EV + currentScore
          )
        } else {
          return getRollContent(
            secondKeepSet.keepSet,
            secondKeepSet.EV + currentScore
          )
        }
      } else if (rollsRemaining === 0 && widget.scoreActionMap) {
        return getScoreContent(
          scoreAction.category,
          currentScore + scoreAction.EV
        )
      }
    }
  }, [dice, rollsRemaining, scores, gameStateEVMap])

  return isLoadingEVMap ? (
    <div className="flex items-center">
      <div>Loading</div>
    </div>
  ) : (
    <div>
      <TabGroup
        className="flex flex-col items-center gap-y-6"
        selectedIndex={selectedAssistantIndex}
      >
        <TabList className="flex gap-4 bg-white p-2 border-gray-100 rounded-full items-center">
          {["Assistant", "Hidden"].map((tab, index) => (
            <Tab
              data-focus="false"
              key={tab}
              className="aria-selected:bg-gray-200 rounded-full px-3 py-1 text-md font-semibold text-black hover:bg-gray-200"
              onClick={(e) => {
                setSelectedAssistantIndex(index)
                e.stopPropagation()
                e.preventDefault()
              }}
            >
              {tab}
            </Tab>
          ))}
        </TabList>
        <TabPanels>
          <TabPanel>{actionMessage}</TabPanel>
          <TabPanel></TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  )
}

export default Monitor
