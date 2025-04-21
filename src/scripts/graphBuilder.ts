import {
  buildWidgetForGameState,
  decodeGameState,
  getAllPossibleGameStateStrings,
} from "../optimal/methods"
import { Widget } from "../optimal/types"

require("fs")

// Build game graph
export const buildGameGraph = () => {
  // graph work backwards from final state
  const widgetEVs: { [key: string]: number } = {}
  const gameStateStrings = getAllPossibleGameStateStrings()
  let counter = 0
  // start a clock
  const startTime = Date.now()

  // calculate EVs for each game state
  for (let gameStateString of gameStateStrings) {
    const gameState = decodeGameState(gameStateString)
    widgetEVs[gameStateString] = buildWidgetForGameState(
      gameState,
      widgetEVs
    ).expectedScore
    counter += 1
    if (counter % 1000 === 0) {
      const currentTime = Date.now()
      const elapsedTime = currentTime - startTime
      console.log(
        `Processed ${counter}/${gameStateStrings.length} Widgets\nElapsed time: ${elapsedTime / 1000.0}s`
      )
      console.log("Latest EV: ", widgetEVs[gameStateString])
    }
  }
  const endTime = Date.now()
  const elapsedTime = endTime - startTime
  console.log(`Processed ${counter} Widgets\nElapsed time: ${elapsedTime} ms`)

  // write the graph to a file
  const graphString = JSON.stringify(widgetEVs, null, 0)
  require("fs").writeFileSync("src/optimal/gameGraph.json", graphString)
}

buildGameGraph()
