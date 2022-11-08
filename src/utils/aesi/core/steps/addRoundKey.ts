import type { AesiRoundStep } from "../../aesi.types";

export const addRoundKey = (state: Uint8Array, expandedKey: Uint8Array, round: number): AesiRoundStep => {
  const inputState = new Uint8Array(state)

  for (let c = 0; c < 4; c++) {
    // @ts-ignore - This index access is safe.
    state[4 * 0 + c] ^= expandedKey[4 * 4 * round + 4 * c + 0];
    // @ts-ignore - This index access is safe.
    state[4 * 1 + c] ^= expandedKey[4 * 4 * round + 4 * c + 1];
    // @ts-ignore - This index access is safe.
    state[4 * 2 + c] ^= expandedKey[4 * 4 * round + 4 * c + 2];
    // @ts-ignore - This index access is safe.
    state[4 * 3 + c] ^= expandedKey[4 * 4 * round + 4 * c + 3];
  }

  const outputState = new Uint8Array(state)

  return {
    inputState,
    outputState,
  }
}