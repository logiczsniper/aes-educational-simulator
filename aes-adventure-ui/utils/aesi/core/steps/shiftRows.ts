import { AesiRoundStep, AesiRoundStepType } from "../../aesi.types";

export const shiftRows = (state: Uint8Array, inverse?: boolean): AesiRoundStep => {
  const inputState = new Uint8Array(state)

  for (let i = 1; i < 4; i++) {
    let s = 0;
    while (s < i) {
      const tmp = inverse ? state[4 * i + 3] : state[4 * i];

      if (inverse) {
        for (let k = 4 - 1; k > 0; k--) {
          // @ts-ignore - This index access is safe.
          state[4 * i + k] = state[4 * i + k - 1];
        }

        // @ts-ignore - This index access is safe.
        state[4 * i] = tmp;
      } else {
        for (let k = 1; k < 4; k++) {
          // @ts-ignore - This index access is safe.
          state[4 * i + k - 1] = state[4 * i + k];
        }

        // @ts-ignore - This index access is safe.
        state[4 * i + 3] = tmp;
      }
      s++;
    }
  }

  const outputState = new Uint8Array(state)

  return {
    type: AesiRoundStepType.ShiftRows,
    inputState,
    outputState,
  }
}