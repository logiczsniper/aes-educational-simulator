import { AesiRoundStepAddKey, AesiRoundStepType } from "../../aesi.types";
import { createState } from "../utils";

export const addRoundKey = (state: Uint8Array, expandedKey: Uint8Array, round: number): AesiRoundStepAddKey => {
  const inputState = new Uint8Array(state)
  const roundKey: Array<number> = []

  for (let c = 0; c < 4; c++) {
    // @ts-ignore - This index access is safe.
    const nibble1 = expandedKey[4 * 4 * round + 4 * c + 0]
    state[4 * 0 + c] ^= nibble1;

    // @ts-ignore - This index access is safe.
    const nibble2 = expandedKey[4 * 4 * round + 4 * c + 1]
    state[4 * 1 + c] ^= nibble2;

    // @ts-ignore - This index access is safe.
    const nibble3 = expandedKey[4 * 4 * round + 4 * c + 2]
    state[4 * 2 + c] ^= nibble3;

    // @ts-ignore - This index access is safe.
    const nibble4 = expandedKey[4 * 4 * round + 4 * c + 3]
    state[4 * 3 + c] ^= nibble4;

    roundKey.push(nibble1, nibble2, nibble3, nibble4)
  }

  const outputState = new Uint8Array(state)

  return {
    type: AesiRoundStepType.AddRoundKey,
    inputState,
    outputState,
    roundKey: createState(Uint8Array.from(roundKey))
  }
}