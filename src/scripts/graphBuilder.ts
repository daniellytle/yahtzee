import {
  buildWidgetForGameState,
  getAllPossibleGameStateStrings,
} from "../optimal/methods"

require("fs")

// Build game graph
export const buildGameGraph = () => {
  // work backwards from final states
  const widgetEVs: { [key: string]: number } = {}
  const gameStateStrings = getAllPossibleGameStateStrings()
  let counter = 0
  // start a clock
  const startTime = Date.now()

  console.log("Building game graph...")

  // calculate EVs for each game state
  for (let gameStateString of gameStateStrings) {
    try {
      const EV = buildWidgetForGameState(
        gameStateString,
        widgetEVs
      ).expectedScore
      widgetEVs[gameStateString] = EV
      counter += 1
    } catch (e) {
      console.error(`Error processing game state: ${gameStateString} ${e}`)
      throw e
    }

    if (counter % 1000 === 0) {
      const currentTime = Date.now()
      const elapsedTime = currentTime - startTime
      console.log(
        `Processed ${counter}/${gameStateStrings.length} Widgets\nElapsed time: ${elapsedTime / 1000.0}s`
      )
    }
  }

  const endTime = Date.now()
  const elapsedTime = endTime - startTime
  console.log(`Processed ${counter} Widgets\nElapsed time: ${elapsedTime} ms`)

  // write the graph to a file
  const widgetEVsJsonString = JSON.stringify(widgetEVs, null, 0)
  require("fs").writeFileSync(
    "src/optimal/gameStateEVs.json",
    widgetEVsJsonString
  )
}

buildGameGraph()
