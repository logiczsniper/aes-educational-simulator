import { AesiOutput } from "../aesi/aesi.types";
import { computeConfusion, computeConfusionPhi } from "./computeConfusion";
import { computeDiffusion, computeDiffusionInitialWork } from "./computeDiffusion";
import { hexToBinary } from "./hexToBinary";

export type AesiStatistics = {
  confusion: Array<number>,
  diffusion: Array<number>
}

const round = (n: number) => Number.parseFloat(n.toPrecision(2))

export const generateStatistics = (output: AesiOutput, key: Uint8Array, cryptoFn: (_: Uint8Array) => AesiOutput): AesiStatistics => {
  const { initialState } = output
  const initialBinary = hexToBinary(initialState)
  const diffusionInitialWork = computeDiffusionInitialWork(initialBinary, cryptoFn)

  const confusion = [] as Array<number>
  const diffusion = [] as Array<number>

  for (let i = 0; i < output.rounds.length; i++) {
    const round = output.rounds[i]
    const inputState = round.steps.at(0)?.inputState
    const outputState = round.steps.at(-1)?.outputState

    if (!inputState || !outputState) continue

    const inputBinary = hexToBinary(inputState)
    const outputBinary = hexToBinary(outputState)

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

/**
 * What feels intuitive to me is this: we want at least 2 measurements: confusion and diffusion.
 * 
 * 1. Confusion: the relationship between the (current) ciphertext and the key. For this metric, maybe 
 * we could use the linear correlation algorithm you suggested? Only concern there is plotting that output
 * onto the same X axis as the other metric(s)...Ideally this would be a percentage as such a value is 
 * self explanatory. Do you have any suggestions that fit these criterion, or a confusion / correlation 
 * metric that could be altered to produce a percentage? E.g. square a correlation coefficient and multiply
 * by 100
 * 
 * 2. Diffusion: the influence of a single plaintext bit on the (current) ciphertext. For this metric, I was
 * thinking of the following - [Context: user is at round i] - flip the first bit of the plaintext and count
 * the number of flipped bits of the resulting ciphertext at round i. Then restart to the original plaintext and
 * flip the second bit of plaintext,
 * repeat. Repeat for all plaintext bits: the diffusion metric can be the average number of ciphertext bits 
 * flipped / 128 as this is the maximum number of ciphertext bits that could be flipped => a percentage! Can 
 * you see any flaws in such a method or is this okay?
 * 
 * I really like the idea of presenting these metrics because of the configurations feature- I would expect 
 * users to select 'No Shift Rows' and when they compare the confusion over the rounds between the standard
 * configuration and 'No Shift Rows', they can observe a lessened confusion. Same with diffusion and 
 * 'No Mix Columns'.
 */