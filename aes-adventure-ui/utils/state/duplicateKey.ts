import { AesiKeySize } from "../aesi/aesi.types"

export const duplicateKey = (key: string, from: 'encrypt' | 'decrypt' | 'key-expansion') => {
  const encryptState = useEncryptState()
  const decryptState = useDecryptState()
  const keyExpansionState = useKeyExpansionState()

  const newKeySize = (key.length * 4) as AesiKeySize

  if (from !== 'encrypt' && encryptState.rawKey !== key) {
    encryptState.reset()
    encryptState.setKeySize(newKeySize)
    encryptState.rawKey = key
  }

  if (from !== 'decrypt' && decryptState.rawKey !== key) {
    decryptState.reset()
    decryptState.setKeySize(newKeySize)
    decryptState.rawKey = key
  }

  if (from !== 'key-expansion' && keyExpansionState.rawKey !== key) {
    keyExpansionState.reset()
    keyExpansionState.setKeySize(newKeySize)
    keyExpansionState.rawKey = key
  }
}