import classNames from "classnames"
import { ReactNode } from "react"
import { JsxElement } from "typescript"

function Die({
  index,
  value,
  onSelect,
}: {
  index: number
  value: number
  onSelect: (x: number) => void
}) {
  const selectDie = () => {
    onSelect(index)
  }

  const dieSvg: {[key: number]: ReactNode} = {
    1: (<>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className="w-full h-auto"
      >
        <circle cx="50" cy="50" r="9" />
      </svg>
    </>
    ),
    2: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className="w-full h-auto"
      >
        <circle cx="25" cy="25" r="9" />
        <circle cx="75" cy="75" r="9" />
      </svg>
    ),
    3: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className="w-full h-auto"
      >
        <circle cx="25" cy="25" r="9" />
        <circle cx="50" cy="50" r="9" />
        <circle cx="75" cy="75" r="9" />
      </svg>
    ),
    4: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className="w-full h-auto"
      >
        <circle cx="25" cy="25" r="9" />
        <circle cx="75" cy="25" r="9" />
        <circle cx="25" cy="75" r="9" />
        <circle cx="75" cy="75" r="9" />
      </svg>
    ),
    5: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className="w-full h-auto"
      >
        <circle cx="25" cy="25" r="9" />
        <circle cx="75" cy="25" r="9" />
        <circle cx="50" cy="50" r="9" />
        <circle cx="25" cy="75" r="9" />
        <circle cx="75" cy="75" r="9" />
      </svg>
    ),
    6: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className="w-full h-auto"
      >
        <circle cx="25" cy="25" r="9" />
        <circle cx="75" cy="25" r="9" />
        <circle cx="25" cy="50" r="9" />
        <circle cx="75" cy="50" r="9" />
        <circle cx="25" cy="75" r="9" />
        <circle cx="75" cy="75" r="9" />
      </svg>
    ),
  }

  return (
    <div
      className={classNames(
        "shadow-md bg-white transition-all h-24 w-24 rounded-xl relative text-3xl flex content-center justify-center flex-wrap cursor-pointer hover:bg-gray-100"
      )}
      onClick={selectDie}
    >
      {dieSvg[value]}
    </div>
  )
}

export default Die
