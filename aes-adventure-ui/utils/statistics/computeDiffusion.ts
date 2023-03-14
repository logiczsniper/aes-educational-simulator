import { AesiOutput } from "../aesi/aesi.types"
import { binaryToHex } from "./binaryToHex"
import { hexToBinary } from "./hexToBinary"


const computeInputVariants = (inputBinary: Array<number>) => {
  const inputBinaryVariants = [] as Array<typeof inputBinary>

  for (let i = 0; i < inputBinary.length; i++) {
    const thisVariant = [...inputBinary]
    thisVariant[i] = Number(!thisVariant[i])
    inputBinaryVariants.push(thisVariant)
  }

  return inputBinaryVariants
}

const countFlips = (a: Array<number>, b: Array<number>) => {
  let flips = 0

  for (let i = 0; i < a.length; i++) flips += Number(a.at(i) !== b.at(i))

  return flips
}

/**
 * Flips each of the inputBinary bits, invoking cryptoFn on each
 * variant of inputBinary.
 */

type DiffusionInitialWork = Array<AesiOutput>
export const computeDiffusionInitialWork = (inputBinary: Array<number>, cryptoFn: (_: Uint8Array) => AesiOutput) => {
  const inputBinaryVariants = computeInputVariants(inputBinary)
  const outputVariants = [] as DiffusionInitialWork

  for (const inputBinaryVariant of inputBinaryVariants) {
    const inputVariant = binaryToHex(inputBinaryVariant)
    const thisOutput = cryptoFn(inputVariant)
    outputVariants.push(thisOutput)
  }

  return outputVariants
}


export const computeDiffusion = (initialWork: DiffusionInitialWork, outputBinary: Array<number>, roundIndex: number) => {
  let flipsTotal = 0

  for (const variantOutput of initialWork) {
    const thisVariantOutputState = variantOutput.rounds.at(roundIndex)?.steps.at(-1)?.outputState

    if (!thisVariantOutputState) continue

    const thisVariantOutputBinary = hexToBinary(thisVariantOutputState)

    flipsTotal = countFlips(outputBinary, thisVariantOutputBinary)
  }

  const flipsAvg = flipsTotal / 128
  const diffusion = flipsAvg * 100

  return diffusion
}
