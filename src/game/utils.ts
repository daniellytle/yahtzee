export const diceRoll = () => {
  const value = Math.floor(Math.random() * 6) + 1
  return value
}

export const getFreshDice = () => {
  return new Array(5).fill(0).map((x) => diceRoll())
}

export const sum = (values: number[]) => {
  return values.reduce((agg, curr) => agg + curr, 0)
}

export const probDiceMatch = (matchingCount: number):number => {
  return 1 / (6 ^ matchingCount)
}

export const binomial = (n: number, k: number): number => {
  let coeff = 1;
  // Calculate the numerator of the binomial coefficient.
  for (let x = n - k + 1; x <= n; x++) coeff *= x;
  // Calculate the denominator of the binomial coefficient.
  for (let x = 1; x <= k; x++) coeff /= x;
  // Return the calculated binomial coefficient.
  return coeff;
}

export const indecesOfMatching = (target: number, values: number[]) => {
  return values.map((value, index) => [value, index]).filter((obj) => obj[0] === target).map((obj) => obj[1])
}