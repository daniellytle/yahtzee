import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react"
import { sum } from "../game/utils"
import Scoring from "../game/scoring"

export function GameReport({
  isOpen,
  totalScore,
  resetGame,
  scoreSheets,
}: {
  isOpen: boolean
  setIsOpen: (x: boolean) => void
  totalScore: number
  resetGame: () => void
  scoreSheets: {[key: string]: number}[]
}) {
  return (
    <>
      <Transition appear show={isOpen}>
        <Dialog
          as="div"
          className="relative z-10 focus:outline-none"
          onClose={() => {}}
        >
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <TransitionChild
                enter="ease-out duration-300"
                enterFrom="opacity-0 transform-[scale(95%)]"
                enterTo="opacity-100 transform-[scale(100%)]"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 transform-[scale(100%)]"
                leaveTo="opacity-0 transform-[scale(95%)]"
              >
                <DialogPanel className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
                  <DialogTitle
                    as="h3"
                    className="text-2xl font-bold text-center"
                  >
                    Game Over
                  </DialogTitle>
                  <p className="mt-2 text-center text-xl">
                    Score: <b>{totalScore}</b>
                  </p>
                  {/* <p className="mt-2 text-center text-xl">
                    Previous Scores: <b>{scoreSheets.map(scoreSheet => Scoring.getTotalScore(scoreSheet)).join(" ")}</b>
                  </p>
                  {scoreSheets.length && <p className="mt-2 text-center text-xl">
                    Avg Score: <b>{sum(scoreSheets.map(scoreSheet => Scoring.getTotalScore(scoreSheet))) / scoreSheets.length}</b>
                  </p>} */}
                  <button className="mt-8 mx-auto bg-red-600 border-b-4 border-red-400 flex text-white text-2xl px-16 py-4 cursor-pointer rounded-xl" onClick={() => resetGame()}>
                    Play Again
                  </button>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
