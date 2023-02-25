import { AesiRoundStep, AesiRoundStepType } from "../../aesi.types";
import { S_BOX, S_BOX_INVERSE } from "../constants";

export const subBytes = (state: Uint8Array, inverse?: boolean): AesiRoundStep => {
  const inputState = new Uint8Array(state)

  const SBOX = inverse ? S_BOX_INVERSE : S_BOX;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      // @ts-ignore - This index access is safe.
      state[4 * i + j] = SBOX[state[4 * i + j]];
    }
  }

  const outputState = new Uint8Array(state)

  return {
    type: AesiRoundStepType.SubBytes,
    inputState,
    outputState,
  }
}