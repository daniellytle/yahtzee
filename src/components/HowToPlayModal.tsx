import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react"
import { useState } from "react"

export function HowToPlayModal({ className }: { className: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <a className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        How-to
      </a>
      <Transition appear show={isOpen}>
        <Dialog
          as="div"
          className="relative z-10 focus:outline-none"
          onClose={() => {
            setIsOpen(false)
          }}
        >
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <TransitionChild
                enter="ease-out duration-300"
                enterFrom="transform-[scale(95%)]"
                enterTo="transform-[scale(100%)]"
                leave="ease-in duration-200"
                leaveFrom="transform-[scale(100%)]"
                leaveTo="transform-[scale(95%)]"
              >
                <DialogPanel className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl flex flex-col space-y-4">
                  <DialogTitle as="h3" className="text-2xl font-bold">
                    How to play
                  </DialogTitle>
                  <p>
                    Click on the die you want to keep before rerolling, then
                    click the score slot for which you want to count the round.
                  </p>
                  <h2 className="font-semibold">Keyboard shortcuts</h2>
                  <p>
                    Click any key 1-5 to select the die of that index and use
                    the space bar to reroll.
                  </p>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
