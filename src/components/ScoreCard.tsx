import classNames from "classnames"
import Scoring from "../game/scoring"
import { ReactElement } from "react"

function ScoreCard({
  scores,
  dice,
  scoreDice,
}: {
  scores: { [key: string]: number }
  dice: number[]
  scoreDice: (key: string, value: number) => void
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
            </div>
          )
        })}
      </>
    )
  }

  const renderBonus = (scores: { [key: string]: number }): ReactElement => {
    return <>
      <div
        className={classNames("my-1 ml-8 py-2 px-4 rounded-md flex justify-between")}
      >
        <div>Sum</div>
        <div className={"text-black"}>{Scoring.getCountingSum(scores)}</div>
      </div>
      <div
        className={classNames("my-1 ml-8 py-2 px-4 rounded-md flex justify-between")}
      >
        <div>Bonus</div>
        <div className={"text-black"}>{Scoring.getBonus(scores)}</div>
      </div>
    </>
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="shadow-md grid grid-cols-1 p-2 bg-white border-gray-100 border rounded-xl">
        <div className="my-1 px-4 py-2 flex justify-between border-b">
          <div>Type</div>
          <div>Score</div>
        </div>
        {renderScorables(Scoring.countingScorables)}
        {renderBonus(scores)}
        {renderScorables(Scoring.complexScorables)}
        <div className="my-1 px-4 py-2 flex justify-between border-t">
          <div>Total</div>
          <div>{Scoring.getTotalScore(scores)}</div>
        </div>
      </div>
    </div>
  )
}

export default ScoreCard
