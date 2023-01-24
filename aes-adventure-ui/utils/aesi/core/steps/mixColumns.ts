import type { AesiRoundStep } from "../../aesi.types";
import { coefMult } from "../utils";

export const mixColumns = (state: Uint8Array, inverse?: boolean): AesiRoundStep => {
  const inputState = new Uint8Array(state)

  const a = new Uint8Array(inverse ? [0x0e, 0x09, 0x0d, 0x0b] : [0x02, 0x01, 0x01, 0x03]);
  const col = new Uint8Array(4);
  let result = new Uint8Array(4);

  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 4; i++) {
      // @ts-ignore - This index access is safe.
      col[i] = state[4 * i + j];
    }
    coefMult(a, col, result);
    for (let i = 0; i < 4; i++) {
      // @ts-ignore - This index access is safe.
      state[4 * i + j] = result[i];
    }
  }

  const outputState = new Uint8Array(state)

  return {
    inputState,
    outputState,
  }
}