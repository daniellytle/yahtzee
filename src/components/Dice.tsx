import { ReactNode, useState } from "react"
import Die from "./Die"
import classNames from "classnames"

function Dice({
  dice,
  roll,
  rolling,
  rollsRemaining,
  selectedDice,
  selectDie,
}: {
  dice: number[]
  roll: (selectedDie: Set<number>, rolls: number) => void
  rolling: boolean
  rollsRemaining: number
  selectedDice: Set<number>
  selectDie: (x: number) => void
}) {
  const handleRollClick = () => {
    roll(selectedDice, rollsRemaining)
  }

  const renderDice = (dice: number[]): ReactNode => {
    return (
      <div className="flex justify-center mb-10 items-start gap-4">
        {dice.map((die, index) => {
          const dieRolling = !selectedDice.has(index) && rolling
          return (
            <div
              style={{"animation": (dieRolling ? "jump .5s 1" : "")}}
              key={index}
              className={classNames("transition-all mt-0", {
                "mt-10": selectedDice.has(index)
              })}
            >
              <Die
                key={`${index}-${die}-${selectedDice.has(index)}`}
                index={index}
                value={die}
                onSelect={selectDie}
              />
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div>
      {renderDice(dice)}
      <div
        className={classNames("mb-4 justify-center bg-red-600 border-b-4 border-red-400 flex text-white text-2xl px-16 py-4 cursor-pointer rounded-xl transition-all",
          {"opacity-40": rollsRemaining == 0},
          {"hover:opacity-90 active:border-0": rollsRemaining > 0})}
        onClick={handleRollClick}
      >
        Roll
      </div>
      {rollsRemaining > 0 && <div className="text-gray-400 font-normal text-center">
        {rollsRemaining} rolls left
      </div>}
    </div>
  )
}

export default Dice
