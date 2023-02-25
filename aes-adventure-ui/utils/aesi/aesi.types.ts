export type AesiKeySize = 128 | 192 | 256;

export type AesiInput = {
  key: Uint8Array;
  config: AesiConfig;
}

export enum AesiDefaultConfig {
  Standard = "standard",
  Short = "short",
  Long = "long",
  StaticColumns = "staticColumns",
  StaticRows = "staticRows",
  StaticBytes = "staticBytes"
}

export type AesiConfig = {
  defaultConfig?: AesiDefaultConfig;

  // Advanced configs:
  // rounds?: number;
  // skips?: any;
}

export type AesiOutput = {
  // Plaintext or ciphertext
  block: Uint8Array;

  // Input transformed into state matrix
  initialState: Uint8Array;

  // Initial or final key addition
  symmetryKeyAddition: AesiRoundStep;

  // Includes short round
  rounds: Array<AesiRound>
}

export type AesiRound = {
  steps: AesiRoundStep[];
}

export enum AesiRoundStepType {
  AddKey,
  SubBytes,
  ShiftRows,
  MixColumns,
  AddRoundKey,
}

export type AesiRoundStep<T = never> = {
  type: AesiRoundStepType;
  inputState: Uint8Array;
  outputState: Uint8Array;
  meta?: T;
}