import { AesiExpandKeyOutput, AesiExpandKeyRound, AesiExpandKeyRoundStep, AesiExpandKeyRoundStepRoundGFn, AesiExpandKeyRoundStepRoundHFn, AesiExpandKeyRoundStepType } from "../aesi.types";
import { rotWord, subWord, coefAdd, gmult } from "./utils";

export const expandKey = (key: Uint8Array, roundCount: number, keyCount: number): AesiExpandKeyOutput => {
  const expandedKey = new Uint8Array(4 * (roundCount + 1) * 4);
  expandedKey.set(key)

  const length = 4 * (roundCount + 1);
  const tmp = new Uint8Array(4);

  const rounds = [] as AesiExpandKeyOutput['rounds']

  let thisRound = { steps: [] as Array<AesiExpandKeyRoundStep> }
  let thisRoundAddWords = {
    type: AesiExpandKeyRoundStepType.AddWords,
    inputWords: [],
    outputWords: [],
  } as AesiExpandKeyRoundStep

  // This creates one word per iteration - we need to make groups of 8 add key steps.
  // keyCount is the number of words per round (4, 6, 8)
  for (let i = keyCount; i < length; i++) {
    const previousWord = expandedKey.subarray(4 * (i - 1), 4 * (i - 1) + 4)
    tmp.set(previousWord)

    const shouldInvokeG = i % keyCount === 0
    const shouldInvokeH = keyCount > 6 && i % keyCount === 4
    if (shouldInvokeG) {
      rotWord(tmp);
      const rotateWordOutput = Uint8Array.from(tmp)
      subWord(tmp);
      const subWordOutput = Uint8Array.from(tmp)
      // Rcon take 8 LSB of roundConstant(i / keyCount)[0] to get
      // same numbers as the book (beyond arent used anyway). Use bitmask to do so.
      const [thisRoundConstant] = roundConstant(i / keyCount)
      const lsbRoundConstant = thisRoundConstant & 0b11111111
      coefAdd(tmp, roundConstant(i / keyCount) as any, tmp);
      const addRoundConstantOutput = Uint8Array.from(tmp)

      thisRound.steps.push({
        type: AesiExpandKeyRoundStepType.RoundGFn,
        rotateWordOutput,
        subWordOutput,
        addRoundConstantOutput: {
          output: addRoundConstantOutput,
          roundConstant: lsbRoundConstant,
        }
      } as AesiExpandKeyRoundStepRoundGFn)
    } else if (shouldInvokeH) {
      subWord(tmp);
      const subWordOutput = Uint8Array.from(tmp)

      thisRound.steps.push({
        type: AesiExpandKeyRoundStepType.RoundHFn,
        subWordOutput,
      } as AesiExpandKeyRoundStepRoundHFn)
    }

    // @ts-ignore - This index access is safe.
    expandedKey[4 * i + 0] = expandedKey[4 * (i - keyCount) + 0] ^ tmp[0];
    const output1 = expandedKey[4 * i + 0]
    // @ts-ignore - This index access is safe.
    expandedKey[4 * i + 1] = expandedKey[4 * (i - keyCount) + 1] ^ tmp[1];
    const output2 = expandedKey[4 * i + 1]
    // @ts-ignore - This index access is safe.
    expandedKey[4 * i + 2] = expandedKey[4 * (i - keyCount) + 2] ^ tmp[2];
    const output3 = expandedKey[4 * i + 2]
    // @ts-ignore - This index access is safe.
    expandedKey[4 * i + 3] = expandedKey[4 * (i - keyCount) + 3] ^ tmp[3];
    const output4 = expandedKey[4 * i + 3]

    thisRoundAddWords.inputWords.push(tmp)
    thisRoundAddWords.outputWords.push(Uint8Array.from([output1, output2, output3, output4]))

    if (thisRoundAddWords.inputWords.length === keyCount) {
      thisRound.steps.push({ ...thisRoundAddWords })
      thisRoundAddWords.inputWords = []
      thisRoundAddWords.outputWords = []

      rounds.push({ ...thisRound })
      thisRound.steps = []
    }
  }

  if (thisRound.steps.length) {
    thisRound.steps.push({ ...thisRoundAddWords })
    rounds.push({ ...thisRound })
  }


  return {
    expandedKey,
    keyCount,
    rounds,
  };
}

function roundConstant(i: number) {
  const AES_R: number[] = [0x02, 0x00, 0x00, 0x00];
  if (i == 1) {
    AES_R[0] = 0x01;
  } else if (i > 1) {
    AES_R[0] = 0x02;
    i--;
    while (i - 1 > 0) {
      AES_R[0] = gmult(AES_R[0], 0x02);
      i--;
    }
  }

  return AES_R;
}