import { hexToBinary } from "./hexToBinary"

const mapToRho = (binary: Array<number>) => binary.map(b => b === 0 ? -1 : 1)

const computeNorm = (binaryRho: Array<number>) => Math.sqrt(binaryRho.reduce((acc, cur) => acc + Math.pow(cur, 2)))

export const computeConfusion = (key: Uint8Array, outputBinary: Array<number>) => {
  const keyBinaryRho = mapToRho(hexToBinary(key))
  const outputBinaryRho = mapToRho(outputBinary)
  const n = 128

  // TODO: pad outputBinaryRho for (let i = 0; i < keyBinaryRho.length - outputBinaryRho.length; i++) outputBinaryRho.push(0) // or push -1 ??
  // n = outputBinaryRho.length

  const keyBinaryRhoNorm = computeNorm(keyBinaryRho)
  const outputBinaryRhoNorm = computeNorm(outputBinaryRho)

  let rhoMax = null
  let rhoMaxDiff = null

  for (let k = 0; k < n - 1; k++) {
    let sum = 0

    for (let j = 0; j < n; j++) {
      sum += outputBinaryRho[j] * keyBinaryRho[((j + k) % n)]
    }

    const rho = (1 / (keyBinaryRhoNorm * outputBinaryRhoNorm)) * sum
    const rhoDiff = Math.abs(rho)

    if (rhoMaxDiff === null || rhoDiff > rhoMaxDiff) {
      rhoMax = rho
      rhoMaxDiff = rhoDiff
    }
  }

  const confusion = Math.max((1 - Math.abs(rhoMax as number)) * 100, 0)

  return confusion
}

export const computeConfusionPhi = (key: Uint8Array, outputBinary: Array<number>) => {
  const keyBinary = hexToBinary(key)

  // const table = [
  //   [0, 0],
  //   [0, 0]
  // ]

  let n00 = 0
  let n10 = 0
  let n01 = 0
  let n11 = 0

  for (let i = 0; i < outputBinary.length; i++) {
    const x = keyBinary[i]
    const y = outputBinary[i]

    // table[x][y] += 1

    if (x === 0 && y === 0) n00 += 1
    if (x === 0 && y === 1) n01 += 1
    if (x === 1 && y === 0) n10 += 1
    if (x === 1 && y === 1) n11 += 1
  }

  // const [
  //   [n00, n01],
  //   [n10, n11]
  // ] = table

  const n_1 = n11 + n01
  const n_0 = n10 + n00
  const n1_ = n11 + n10
  const n0_ = n01 + n00

  const phi = (n11 * n00 - n10 * n01) / Math.sqrt(n1_ * n0_ * n_0 * n_1)

  return Math.abs(phi) * 100
}