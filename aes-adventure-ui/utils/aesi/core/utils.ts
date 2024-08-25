import { S_BOX } from "./constants";

export const createState = (block: Uint8Array) => {
  const state = new Uint8Array(4 * 4);

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      // @ts-ignore - This index access is safe.
      state[4 * i + j] = block[i + 4 * j];
    }
  }

  return state;
}

export const stateToResult = (state: Uint8Array) => {
  let result = new Uint8Array(16);

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      // @ts-ignore - This index access is safe.
      result[i + 4 * j] = state[4 * i + j];
    }
  }

  return result;
}

export const subWord = (w: Uint8Array) => {
  for (let i = 0; i < 4; i++) {
    // @ts-ignore - This index access is safe.
    w[i] = S_BOX[16 * ((w[i] & 0xf0) >> 4) + (w[i] & 0x0f)];
  }
}
export const rotWord = (w: Uint8Array) => {
  let tmp = w[0];
  for (let i = 0; i < 3; i++) {
    // @ts-ignore - This index access is safe.
    w[i] = w[i + 1];
  }
  // @ts-ignore - This index access is safe.
  w[3] = tmp;
}

export const gmult = (a: number, b: number) => {
  let p = 0, hbs = 0;

  for (let i = 0; i < 8; i++) {
    if (b & 1) {
      p ^= a;
    }

    hbs = a & 0x80;
    a <<= 1;
    if (hbs) {
      a ^= 0x1b;
    }
    b >>= 1;
  }

  return p;
}

export const coefAdd = (a: Uint8Array, b: Uint8Array, d: Uint8Array) => {
  // @ts-ignore - This index access is safe.
  d[0] = a[0] ^ b[0];
}

export const coefMult = (a: Uint8Array, b: Uint8Array, d: Uint8Array) => {
  // @ts-ignore - This index access is safe.
  d[0] = gmult(a[0], b[0]) ^ gmult(a[3], b[1]) ^ gmult(a[2], b[2]) ^ gmult(a[1], b[3]);
  // @ts-ignore - This index access is safe.
  d[1] = gmult(a[1], b[0]) ^ gmult(a[0], b[1]) ^ gmult(a[3], b[2]) ^ gmult(a[2], b[3]);
  // @ts-ignore - This index access is safe.
  d[2] = gmult(a[2], b[0]) ^ gmult(a[1], b[1]) ^ gmult(a[0], b[2]) ^ gmult(a[3], b[3]);
  // @ts-ignore - This index access is safe.
  d[3] = gmult(a[3], b[0]) ^ gmult(a[2], b[1]) ^ gmult(a[1], b[2]) ^ gmult(a[0], b[3]);
}