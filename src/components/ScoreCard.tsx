import classNames from "classnames"
import Scoring from "../game/scoring"
import { ReactElement } from "react"

function ScoreCard({
  scores,
  dice,
  scoreDice,
  rollsRemaining,
}: {
  scores: { [key: string]: number }
  dice: number[]
  scoreDice: (key: string, value: number) => void
  rollsRemaining: number
}) {
  const getScoreSheetValue = (key: string): number => {
    if (key in scores) {
      return scores[key]
    } else {
      return Scoring.scorableRules[key](dice)
    }
  }

  const handleScorableClick = (key: string) => {
    if (key in scores) {
      return
    } else {
      scoreDice(key, Scoring.scorableRules[key](dice))
    }
  }

  const renderScorables = (scorables: string[]): ReactElement => {
    return (
      <>
        {scorables.map((key, index) => {
          const locked = key in scores
          const expectedValue: number = locked
            ? scores[key]
            : Scoring.scorableExpectedValue[key](dice, rollsRemaining)
          const maxScore: number = Scoring.scorableMaxValue[key]
          return (
            <div
              key={index}
              className={classNames(
                "my-1 py-2 px-4 rounded-md flex justify-between",
                { "hover:bg-slate-200 cursor-pointer bg-white": !locked },
                { "bg-gray-200": locked }
              )}
              onClick={() => handleScorableClick(key)}
            >
              <div>{key}</div>
              <div
                className={classNames(
                  { "text-black": locked },
                  { "text-gray-400": !locked }
                )}
              >
                {getScoreSheetValue(key)}
              </div>
              {/* {
                !locked && <div
                  className={classNames("w-12 align-middle",
                    { "text-black": locked },
                    { "text-gray-400": !locked }
                  )}
                >
                  {expectedValue.toFixed(2)}
                  <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-100">
                    <div className="bg-blue-600 h-1.5 rounded-full dark:bg-blue-500" style={{width: `${(100 * expectedValue) / maxScore}%`}}></div>
                  </div>
                </div>
              } */}
            </div>
          )
        })}
      </>
    )
  }

  const renderBonus = (scores: { [key: string]: number }): ReactElement => {
    return (
      <>
        <div
          className={classNames(
            "my-1 ml-8 py-2 px-4 rounded-md flex justify-between"
          )}
        >
          <div>Sum</div>
          <div className={"text-black"}>{Scoring.getCountingSum(scores)}</div>
        </div>
        <div
          className={classNames(
            "my-1 ml-8 py-2 px-4 rounded-md flex justify-between"
          )}
        >
          <div>Bonus</div>
          <div className={"text-black"}>{Scoring.getBonus(scores)}</div>
        </div>
      </>
    )
  }

  return (
    <div className="w-full h-full max-w-md px-4 mx-auto flex">
      <div className=" md:mt-0 self-center h-full md:h-auto w-full shadow-md grid grid-cols-1 p-2 bg-white border-gray-100 border rounded-xl">
        <div className="mt-1 px-4 pb-2 flex justify-between border-b">
          <div>Score</div>
          <div>Points</div>
          {/* <div>EV</div> */}
        </div>
        <div className="overflow-scroll">
          {renderScorables(Scoring.countingScorables)}
          {renderBonus(scores)}
          {renderScorables(Scoring.complexScorables)}
        </div>
        <div className="mb-1 px-4 pt-2 flex justify-between border-t">
          <div>Total</div>
          <div>{Scoring.getTotalScore(scores)}</div>
        </div>
      </div>
    </div>
  )
}

export default ScoreCard
