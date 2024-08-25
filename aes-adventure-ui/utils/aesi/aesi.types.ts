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
  steps: Array<AesiRoundStep>;
}

export enum AesiRoundStepType {
  // AddKey,
  SubBytes,
  ShiftRows,
  MixColumns,
  AddRoundKey,
}

export type AesiRoundStep = {
  type: AesiRoundStepType;
  inputState: Uint8Array;
  outputState: Uint8Array;
}

export interface AesiRoundStepAddKey extends AesiRoundStep {
  type: AesiRoundStepType.AddRoundKey,
  roundKey: Uint8Array
}

export function isAddRoundKey(roundStep: AesiRoundStep): roundStep is AesiRoundStepAddKey {
  return roundStep.type === AesiRoundStepType.AddRoundKey
}

export type AesiExpandKeyOutput = {
  // Full key
  expandedKey: Uint8Array;

  // Total number of keys
  keyCount: number;

  rounds: Array<AesiExpandKeyRound>;
}

export type AesiExpandKeyRound = {
  steps: Array<AesiExpandKeyRoundStep>
}

export enum AesiExpandKeyRoundStepType {
  RoundGFn,
  RoundHFn,
  AddWords
}

export type AesiExpandKeyRoundStep = AesiExpandKeyRoundStepAddWords | AesiExpandKeyRoundStepRoundGFn | AesiExpandKeyRoundStepRoundHFn

export interface AesiExpandKeyRoundStepAddWords {
  type: AesiExpandKeyRoundStepType.AddWords,
  inputWords: Array<Uint8Array>;
  outputWords: Array<Uint8Array>;
}

export interface AesiExpandKeyRoundStepRoundGFn {
  type: AesiExpandKeyRoundStepType.RoundGFn,
  inputWord: Uint8Array;
  rotateWordOutput: Uint8Array;
  subWordOutput: Uint8Array;
  addRoundConstantOutput: {
    // ROUND CONSTANT IS BASE 10 USE toString(radix) BEFORE USE
    roundConstant: number;
    output: Uint8Array;
  };
}

export interface AesiExpandKeyRoundStepRoundHFn {
  type: AesiExpandKeyRoundStepType.RoundHFn;
  inputWord: Uint8Array;
  subWordOutput: Uint8Array;
}
