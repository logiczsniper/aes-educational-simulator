export type AesiKeySize = 16 | 24 | 32;

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
  steps: [AesiRoundStep, AesiRoundStep, AesiRoundStep, AesiRoundStep] | [AesiRoundStep, AesiRoundStep, AesiRoundStep];
}

export type AesiRoundStep<T = never> = {
  inputState: any;
  outputState: any;
  meta?: T;
}