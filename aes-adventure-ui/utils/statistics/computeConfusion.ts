import { hexToBinary } from "./hexToBinary"

const mapToRho = (binary: Array<number>) => binary.map(b => b === 0 ? -1 : 1)

// TODO: try computing everything at the start of each round

export const computeConfusion = (key: Uint8Array, outputBinary: Array<number>) => {
  const keyBinaryRho = mapToRho(hexToBinary(key))
  const outputBinaryRho = mapToRho(outputBinary)
  const n = 128

  // let rhoSum = 0

  let rhoMax = null
  let rhoMaxDiff = null

  for (let k = 0; k < n - 1; k++) {
    let sum = 0

    for (let j = 0; j < n; j++) {
      sum += outputBinaryRho[j] * keyBinaryRho[((j + k) % n)]
    }

    const rho = (1 / n) * sum
    const rhoDiff = Math.abs(rho)

    if (rhoMaxDiff === null || rhoDiff > rhoMaxDiff) {
      rhoMax = rho
      rhoMaxDiff = rhoDiff
    }
    // rhoSum += rho
  }

  // const confusion = (1 / (n - 1)) * rhoSum

  const confusion = Math.abs(rhoMax as number) * 100

  return confusion
}