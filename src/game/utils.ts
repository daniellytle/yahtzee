export const diceRoll = () => {
  return Math.floor(Math.random() * 6) + 1
}

export const getFreshDice = () => {
  return new Array(5).fill(0).map((x) => diceRoll())
}

export const scoreTypes = [
  "Ones",
  "Twos",
  "Threes",
  "Fours",
  "Fives",
  "Sixes"
]
