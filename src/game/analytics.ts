import { Player } from "./player"
import { NaivePlayer } from "./players/naivePlayer"
import { OptimalPlayer } from "./players/optimalPlayer"
import { SmartPlayer } from "./players/smartPlayer"
import { Runner } from "./runner"
import Scoring from "./scoring"
import { sum } from "./utils"

export class Analytics {
  static playGames(player: Player, gameCount: number = 100, verbose = false) {
    console.log(`Playing ${gameCount} games with ${player.constructor.name}`)
    const scores = []
    for (let index = 0; index < gameCount; index++) {
      scores.push(Runner.play(player, verbose))
    }
    this.printResults(scores, gameCount)
  }

  static printResults(scores: { [key: string]: number }[], gameCount: number) {
    const totalScores = scores.map((score) => Scoring.getTotalScore(score))
    console.log("avg score: ", sum(totalScores) / gameCount)
    console.log("high score: ", Math.max(...totalScores))
    console.log("low score: ", Math.min(...totalScores))

    for (let scorable of Scoring.scorables) {
      const scorableAvg =
        sum(scores.map((score) => score[scorable])) / gameCount
      console.log(`${scorable} avg score: ${scorableAvg}`)
    }
  }
}

Analytics.playGames(new OptimalPlayer(), 100)
