import { AesiOutput } from "../aesi/aesi.types";
import { computeConfusion, computeConfusionPhi } from "./computeConfusion";
import { computeDiffusion, computeDiffusionInitialWork } from "./computeDiffusion";
import { hexToBinary } from "./hexToBinary";

export type AesiStatistics = {
  confusion: Array<number>,
  diffusion: Array<number>
}

const round = (n: number) => Number.parseFloat(n.toPrecision(2))

export const generateEncryptStatistics = (output: AesiOutput, key: Uint8Array, encrypt: (_: Uint8Array) => AesiOutput): AesiStatistics => {
  const { initialState } = output
  const initialBinary = hexToBinary(initialState)
  const diffusionInitialWork = computeDiffusionInitialWork(initialBinary, encrypt)

  const confusion = [] as Array<number>
  const diffusion = [] as Array<number>

  for (let i = 0; i < output.rounds.length; i++) {
    const round = output.rounds[i]
    const inputState = round.steps.at(0)?.inputState
    const outputState = round.steps.at(-1)?.outputState

    if (!inputState || !outputState) continue

    const inputBinary = hexToBinary(inputState)

    confusion.push(computeConfusion(key, inputBinary))
    diffusion.push(computeDiffusion(diffusionInitialWork, inputBinary, i))
  }

  const finalOutputState = output.rounds.at(-1)?.steps.at(-1)?.outputState
  const finalOutputBinary = hexToBinary(finalOutputState as Uint8Array)
  diffusion.push(computeDiffusion(diffusionInitialWork, finalOutputBinary, output.rounds.length - 1, true))
  confusion.push(computeConfusion(key, finalOutputBinary))

  return {
    diffusion: diffusion.map(round),
    confusion: confusion.map(round)
  }
}

export const generateDecryptStatistics = (output: AesiOutput, key: Uint8Array, decrypt: (_: Uint8Array) => AesiOutput): AesiStatistics => {
  const { initialState } = output
  const initialBinary = hexToBinary(initialState)
  const diffusionInitialWork = computeDiffusionInitialWork(initialBinary, decrypt)

  const confusion = [] as Array<number>
  const diffusion = [] as Array<number>

  for (let i = 0; i < output.rounds.length; i++) {
    const round = output.rounds[i]
    const inputState = round.steps.at(0)?.inputState
    const outputState = round.steps.at(-1)?.outputState

    if (!inputState || !outputState) continue

    const outputBinary = hexToBinary(outputState)

    confusion.push(computeConfusion(key, outputBinary))
    diffusion.push(computeDiffusion(diffusionInitialWork, outputBinary, i))
  }

  const finalOutputState = output.symmetryKeyAddition.outputState
  const finalOutputBinary = hexToBinary(finalOutputState)
  diffusion.push(computeDiffusion(diffusionInitialWork, finalOutputBinary, output.rounds.length - 1, true))
  confusion.push(computeConfusion(key, finalOutputBinary))

  return {
    diffusion: diffusion.map(round),
    confusion: confusion.map(round)
  }
}
