import type { AesiInput, AesiKeySize, AesiOutput, AesiRound } from "./aesi.types";

import { ROUND_COUNT, KEY_COUNT } from "./core/constants";
import { createState, stateToResult } from "./core/utils";
import { expandKey } from "./core/expandKey";
import { addRoundKey } from "./core/steps/addRoundKey";
import { subBytes } from "./core/steps/subBytes";
import { mixColumns } from "./core/steps/mixColumns";
import { shiftRows } from "./core/steps/shiftRows";

/**
 * A(dvanced)
 * E(ncryption)
 * S(tandard)
 * I(nteractive)
 * 
 * Implements AES but with 2 primary differences:
 *  1. Configurable via the [config] which will be used
 *     for Playground mode.
 *  2. Output includes ALL intermediate states which will
 *     be used for the animations.
 */
export const aesi = ({ key, config }: AesiInput) => {
  const keySize = key.length as AesiKeySize;
  const roundCount = ROUND_COUNT[keySize];
  const keyCount = KEY_COUNT[keySize];

  const expandedKey = expandKey(key, roundCount, keyCount);

  return {
    encrypt: (plaintext: Uint8Array): AesiOutput => {
      const state = createState(plaintext);
      const initialState = new Uint8Array(state)
      const rounds = []

      const initialKeyAddition = addRoundKey(state, expandedKey, 0);

      for (let r = 1; r <= roundCount; r++) {
        const includeMixColumns = r !== roundCount;
        rounds.push({
          steps: [
            subBytes(state),
            shiftRows(state),
            includeMixColumns && mixColumns(state),
            addRoundKey(state, expandedKey, r),
          ]
            .filter(Boolean) as AesiRound['steps']
        })
      }

      const ciphertext = stateToResult(state)

      return {
        block: ciphertext,
        initialState,
        symmetryKeyAddition: initialKeyAddition,
        rounds,
      }
    },
    decrypt: (ciphertext: Uint8Array): AesiOutput => {
      const state = createState(ciphertext);
      const initialState = new Uint8Array(state)
      const rounds = []

      for (let r = roundCount; r >= 1; r--) {
        const includeMixColumns = r !== roundCount;
        rounds.push({
          steps: [
            addRoundKey(state, expandedKey, r),
            includeMixColumns && mixColumns(state, true),
            shiftRows(state, true),
            subBytes(state, true),
          ]
            .filter(Boolean) as AesiRound['steps']
        })
      }

      const finalKeyAddition = addRoundKey(state, expandedKey, 0);

      const plaintext = stateToResult(state)

      return {
        block: plaintext,
        initialState,
        symmetryKeyAddition: finalKeyAddition,
        rounds,
      }
    }

  }
}
