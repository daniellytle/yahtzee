import { useState } from "react";
import ScoreCard from "./ScoreCard";
import Dice from "./Dice";
import { diceRoll, getFreshDice } from "../game/utils";
import Scoring from "../game/scoring";
import { GameReport } from "./GameReport";

function Yahtzee() {

  const [dice, setDice] = useState<number[]>(getFreshDice())
  const [reportOpen, setReportOpen] = useState(false)
  const [rolling, setRolling] = useState<boolean>(false)
  const [scores, setScores] = useState<{[key:string]: number}>({})
  const [rollsRemaining, setRollsRemaining] = useState(2)
  const [selectedDice, setSelectedDice] = useState<Set<number>>(new Set())

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
        if (rollsRemaining == 1) {
          setSelectedDice(new Set())
        }
      }, 500)
    }
  }

  const scoreDice = (key: string, value: number) => {
    scores[key] = value
    setScores({
      ...scores
    })
    if (Scoring.gameIsComplete(scores)) {
      setReportOpen(true)
    } else {
      setSelectedDice(new Set())
      rollAllDice()
    }
  }

  const rollAllDice = (selectDice: Set<number> = new Set()) => {
    roll(selectedDice)
  }

  const resetGame = () => {
    setReportOpen(false)
    setScores({})
    rollAllDice()
  }

  return (
    <div className="w-screen h-screen bg-slate-200">
      <div className="container mx-auto font-bold h-screen flex">
        <div className="w-3/5 h-full flex justify-center content-center flex-wrap">
          <Dice dice={dice} roll={roll} rolling={rolling} rollsRemaining={rollsRemaining} selectedDice={selectedDice} selectDie={selectDie} />
        </div>
        <div className="w-2/5 h-full flex content-center flex-wrap">
          <ScoreCard scores={scores} dice={dice} scoreDice={scoreDice}/>
        </div>
      </div>
      <GameReport isOpen={reportOpen} setIsOpen={setReportOpen} totalScore={Scoring.getTotalScore(scores)} resetGame={resetGame}/>
    </div>
  );
}

export default Yahtzee;