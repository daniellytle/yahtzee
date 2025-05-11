import { useEffect, useState } from "react"
import ScoreCard from "./ScoreCard"
import Dice from "./Dice"
import { diceRoll, getFreshDice } from "../game/utils"
import Scoring from "../game/scoring"
import { GameReport } from "./GameReport"
import Monitor from "./Monitor"
import Menu from "./Menu"

function Yahtzee() {
  const [dice, setDice] = useState<number[]>([])
  const [reportOpen, setReportOpen] = useState(false)
  const [rolling, setRolling] = useState<boolean>(false)
  const [scores, setScores] = useState<{ [key: string]: number }>({})
  const [scoreSheets, setScoreSheets] = useState<{ [key: string]: number }[]>(
    []
  )
  const [rollsRemaining, setRollsRemaining] = useState(2)
  const [selectedDice, setSelectedDice] = useState<Set<number>>(new Set())

  const handleKeyDown = (event: KeyboardEvent): any => {
    if (
      !event.metaKey &&
      !event.ctrlKey &&
      ["1", "2", "3", "4", "5", " "].includes(event.key)
    ) {
      event.preventDefault()
      if (event.key === " ") {
        roll(selectedDice, rollsRemaining)
      } else if ([1, 2, 3, 4, 5].includes(parseInt(event.key))) {
        const key = parseInt(event.key)
        selectDie(key - 1)
      }
    }
  }

  useEffect(() => {
    setDice(getFreshDice())
  }, [])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedDice, rollsRemaining, rolling])

  const selectDie = (index: number) => {
    if (rollsRemaining > 0) {
      if (selectedDice.has(index)) {
        selectedDice.delete(index)
        setSelectedDice(new Set(selectedDice))
      } else {
        selectedDice.add(index)
        setSelectedDice(new Set(selectedDice))
      }
    }
  }

  const roll = (selectedDice: Set<number>, rollsRemaining = 3) => {
    if (rollsRemaining > 0 && !rolling) {
      setRolling(true)
      setDice((previous: number[]) => {
        return previous.map((die, index) => {
          return selectedDice.has(index) ? die : diceRoll()
        })
      })
      setRollsRemaining(rollsRemaining - 1)
      setTimeout(() => {
        setRolling(false)
        if (rollsRemaining === 1) {
          setSelectedDice(new Set())
        }
      }, 500)
    }
  }

  const scoreDice = (key: string, value: number) => {
    scores[key] = value
    setScores({
      ...scores,
    })
    if (Scoring.gameIsComplete(scores)) {
      setReportOpen(true)
    } else {
      setSelectedDice(new Set())
      rollAllDice()
    }
  }

  const rollAllDice = () => {
    roll(new Set())
    setSelectedDice(new Set())
  }

  const resetGame = () => {
    setScoreSheets(scoreSheets.concat(scores))
    setReportOpen(false)
    setScores({})
    rollAllDice()
  }

  return (
    <div className="w-screen h-screen bg-slate-200 flex">
      <div className="absolute top-0 w-full py-10 flex justify-center">
        <Menu />
      </div>
      <div className="container mx-auto font-bold flex md:flex-row flex-col mt-36 md:mt-0">
        <div className="md:order-2 h-2/5 md:m-0 w-full md:w-2/5 md:h-full flex content-center flex-wrap">
          <ScoreCard
            scores={scores}
            dice={dice}
            scoreDice={scoreDice}
            rollsRemaining={rollsRemaining}
          />
        </div>
        <div className="md:order-1 h-2/5 md:m-0 md:w-3/5 md:h-full justify-center content-center flex flex-col">
          <div className="flex flex-col items-center p-10 md:p-0 space-y-8">
            <Dice
              dice={dice}
              roll={roll}
              rolling={rolling}
              rollsRemaining={rollsRemaining}
              selectedDice={selectedDice}
              selectDie={selectDie}
            />
            <Monitor
              selectedDice={selectedDice}
              dice={dice}
              rollsRemaining={rollsRemaining}
              scores={scores}
            />
          </div>
        </div>
      </div>
      <GameReport
        isOpen={reportOpen}
        setIsOpen={setReportOpen}
        totalScore={Scoring.getTotalScore(scores)}
        resetGame={resetGame}
        scoreSheets={scoreSheets}
      />
    </div>
  )
}

export default Yahtzee
