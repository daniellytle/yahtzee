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
  const widgetMap: { [key: string]: Widget } = {}
  const gameStateStrings = getAllPossibleGameStateStrings()
  let counter = 0
  // start a clock
  const startTime = Date.now()

  // calculate EVs for each game state
  for (let gameStateString of gameStateStrings) {
    const gameState = decodeGameState(gameStateString)
    widgetMap[gameStateString] = buildWidgetForGameState(gameState, widgetMap)

    if (counter > 1000) {
      break
    }
    counter += 1
  }
  const endTime = Date.now()
  const elapsedTime = endTime - startTime
  console.log(`Processed ${counter} Widgets\nElapsed time: ${elapsedTime} ms`)

  // write the graph to a file
  const graphString = JSON.stringify(widgetMap, null, 0)
  require("fs").writeFileSync("src/optimal/gameGraph.json", graphString)
}

buildGameGraph()
