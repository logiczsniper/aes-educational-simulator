import { rotWord, subWord, coefAdd, gmult } from "./utils";

export const expandKey = (key: Uint8Array, roundCount: number, keyCount: number) => {
  const expandedKey = new Uint8Array(4 * (roundCount + 1) * 4);
  expandedKey.set(key)

  const length = 4 * (roundCount + 1);
  const tmp = new Uint8Array(4);

  for (let i = keyCount; i < length; i++) {
    const previousRoundKey = expandedKey.subarray(4 * (i - 1), 4 * (i - 1) + 4)
    tmp.set(previousRoundKey)

    const shouldInvokeG = i % keyCount === 0
    const shouldInvokeH = keyCount > 6 && i % keyCount === 4
    if (shouldInvokeG) {
      rotWord(tmp);
      subWord(tmp);
      coefAdd(tmp, roundConstant(i / keyCount) as any, tmp);
    } else if (shouldInvokeH) {
      subWord(tmp);
    }

    // @ts-ignore - This index access is safe.
    expandedKey[4 * i + 0] = expandedKey[4 * (i - keyCount) + 0] ^ tmp[0];
    // @ts-ignore - This index access is safe.
    expandedKey[4 * i + 1] = expandedKey[4 * (i - keyCount) + 1] ^ tmp[1];
    // @ts-ignore - This index access is safe.
    expandedKey[4 * i + 2] = expandedKey[4 * (i - keyCount) + 2] ^ tmp[2];
    // @ts-ignore - This index access is safe.
    expandedKey[4 * i + 3] = expandedKey[4 * (i - keyCount) + 3] ^ tmp[3];
  }

  return expandedKey;
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