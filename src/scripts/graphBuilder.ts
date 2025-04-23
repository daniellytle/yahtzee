import {
  buildWidgetForGameState,
  decodeGameState,
  getAllPossibleGameStateStrings,
} from "../optimal/methods"

require("fs")

// Build game graph
export const buildGameGraph = () => {
  // graph work backwards from final state
  const widgetEVs: { [key: string]: number } = {}
  const gameStateStrings = getAllPossibleGameStateStrings()
  let counter = 0
  // start a clock
  const startTime = Date.now()

  console.log("Building game graph...")

  // calculate EVs for each game state
  for (let gameStateString of gameStateStrings) {
    try {
      widgetEVs[gameStateString] = buildWidgetForGameState(
        gameStateString,
        widgetEVs
      ).expectedScore
      counter += 1
    } catch (e) {
      console.log(`Error processing game state: ${gameStateString} ${e}`)
      return
    }

    

    if (counter % 100 === 0) {
      const currentTime = Date.now()
      const elapsedTime = currentTime - startTime
      console.log("Sample game state: ", gameStateString)
      console.log("EV: ", widgetEVs[gameStateString])
      console.log(
        `Processed ${counter}/${gameStateStrings.length} Widgets\nElapsed time: ${elapsedTime / 1000.0}s`
      )
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
