import { AesiExpandKeyOutput, AesiExpandKeyRoundStep, AesiExpandKeyRoundStepAddWords, AesiExpandKeyRoundStepRoundGFn, AesiExpandKeyRoundStepRoundHFn, AesiExpandKeyRoundStepType } from "../aesi.types";
import { coefAdd, gmult, rotWord, subWord } from "./utils";

export const expandKey = (key: Uint8Array, roundCount: number, keyCount: number): AesiExpandKeyOutput => {
  const expandedKey = new Uint8Array(4 * (roundCount + 1) * 4);
  expandedKey.set(key)

  const length = 4 * (roundCount + 1);
  const tmp = new Uint8Array(4);

  const rounds = [] as AesiExpandKeyOutput['rounds']

  const thisRound = { steps: [] as Array<AesiExpandKeyRoundStep> }
  const thisRoundAddWords: AesiExpandKeyRoundStepAddWords = {
    type: AesiExpandKeyRoundStepType.AddWords,
    inputWords: [],
    outputWords: [],
  }
  let thisRoundFunctions: Array<AesiExpandKeyRoundStepRoundGFn | AesiExpandKeyRoundStepRoundHFn> = []

  // This creates one word per iteration - we need to make groups of 8 add key steps.
  // keyCount is the number of words per round (4, 6, 8)
  for (let i = keyCount; i < length; i++) {
    const previousWord = expandedKey.subarray(4 * (i - 1), 4 * (i - 1) + 4)
    tmp.set(previousWord)

    const shouldInvokeG = i % keyCount === 0
    const shouldInvokeH = keyCount > 6 && i % keyCount === 4
    if (shouldInvokeG) {
      const gInput = Uint8Array.from(tmp)

      subWord(tmp);
      const subWordOutput = Uint8Array.from(tmp)

      rotWord(tmp);
      const rotateWordOutput = Uint8Array.from(tmp)

      // Rcon take 8 LSB of roundConstant(i / keyCount)[0] to get
      // same numbers as the book (beyond arent used anyway). Use bitmask to do so.
      const [thisRoundConstant] = roundConstant(i / keyCount)
      const lsbRoundConstant = thisRoundConstant & 0b11111111
      coefAdd(tmp, roundConstant(i / keyCount) as any, tmp);
      const addRoundConstantOutput = Uint8Array.from(tmp)

      thisRoundFunctions.push({
        type: AesiExpandKeyRoundStepType.RoundGFn,
        inputWord: gInput,
        rotateWordOutput,
        subWordOutput,
        addRoundConstantOutput: {
          output: addRoundConstantOutput,
          roundConstant: lsbRoundConstant,
        }
      })
    } else if (shouldInvokeH) {
      const hInput = Uint8Array.from(tmp)
      subWord(tmp);
      const subWordOutput = Uint8Array.from(tmp)

      thisRoundFunctions.push({
        type: AesiExpandKeyRoundStepType.RoundHFn,
        subWordOutput,
        inputWord: hInput,
      })
    }

    // @ts-ignore - This index access is safe.
    const input1 = expandedKey[4 * (i - keyCount) + 0]
    expandedKey[4 * i + 0] = input1 ^ tmp[0];
    const output1 = expandedKey[4 * i + 0]
    // @ts-ignore - This index access is safe.
    const input2 = expandedKey[4 * (i - keyCount) + 1]
    expandedKey[4 * i + 1] = input2 ^ tmp[1];
    const output2 = expandedKey[4 * i + 1]
    // @ts-ignore - This index access is safe.
    const input3 = expandedKey[4 * (i - keyCount) + 2]
    expandedKey[4 * i + 2] = input3 ^ tmp[2];
    const output3 = expandedKey[4 * i + 2]
    // @ts-ignore - This index access is safe.
    const input4 = expandedKey[4 * (i - keyCount) + 3]
    expandedKey[4 * i + 3] = input4 ^ tmp[3];
    const output4 = expandedKey[4 * i + 3]

    thisRoundAddWords.inputWords.push(Uint8Array.from([input1, input2, input3, input4]))
    thisRoundAddWords.outputWords.push(Uint8Array.from([output1, output2, output3, output4]))

    if (thisRoundAddWords.inputWords.length === keyCount) {
      thisRound.steps.push({ ...thisRoundAddWords }, ...thisRoundFunctions)
      thisRoundFunctions = []
      thisRoundAddWords.inputWords = []
      thisRoundAddWords.outputWords = []

      rounds.push({ ...thisRound })
      thisRound.steps = []
    }
  }

  if (thisRoundFunctions.length) {
    thisRound.steps.push({ ...thisRoundAddWords, inputWords: (rounds.at(-1)?.steps?.at(0) as AesiExpandKeyRoundStepAddWords).outputWords }, ...thisRoundFunctions)
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