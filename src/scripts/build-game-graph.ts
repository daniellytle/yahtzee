import {
  buildWidgetForGameState,
  getAllPossibleGameStateStrings,
  getOutcomeProbabilitiesFromAllKeepSets,
} from "../optimal/methods"

require("fs")

// Build game graph
export const buildGameGraph = () => {
  // work backwards from final states
  const widgetEVs: { [key: string]: number } = {}
  const keepSetProbabilitiesMap: {
    [key: string]: { [key: string]: number }
  } = getOutcomeProbabilitiesFromAllKeepSets()
  const gameStateStrings = getAllPossibleGameStateStrings()
  let counter = 0
  // start a clock
  const startTime = Date.now()
  let intervalTime = startTime

  console.log("Building game graph...")

  // calculate EVs for each game state
  for (let gameStateString of gameStateStrings) {
    try {
      const EV = buildWidgetForGameState(
        gameStateString,
        widgetEVs,
        keepSetProbabilitiesMap
      ).expectedScore
      widgetEVs[gameStateString] = EV
      counter += 1
    } catch (e) {
      console.error(`Error processing game state: ${gameStateString} ${e}`)
      throw e
    }
    if (counter % 100 === 0) {
      const intervalLengthTime = Date.now() - intervalTime
      const elapsedTime = Date.now() - startTime

      console.log(
        `Processed ${counter}/${gameStateStrings.length} Widgets\nElapsed time: ${elapsedTime / 1000.0}s`
      )
      console.log(`${intervalLengthTime / 100}ms per widget`)
      intervalTime = Date.now()
    }
  }

  const endTime = Date.now()
  const elapsedTime = endTime - startTime
  console.log(
    `Processed ${counter} Widgets\nElapsed time: ${elapsedTime / 1000.0}s`
  )

  // write the graph to a file
  const widgetEVsJsonString = JSON.stringify(widgetEVs, null, 0)
  require("fs").writeFileSync(
    "src/optimal/gameStateEVs.json",
    widgetEVsJsonString
  )
}

buildGameGraph()
