import { Tab } from "~~/composables/useSimulatorTabs"
import { AesiKeySize } from "../aesi/aesi.types"

export const duplicateKey = (key: string, from: Tab) => {
  const encryptState = useEncryptState()
  const decryptState = useDecryptState()
  const keyExpansionState = useKeyExpansionState()

  const newKeySize = (key.length * 4) as AesiKeySize

  if (from !== Tab.Encrypt && encryptState.rawKey !== key) {
    encryptState.reset()
    encryptState.setKeySize(newKeySize)
    encryptState.rawKey = key
  }

  if (from !== Tab.Decrypt && decryptState.rawKey !== key) {
    decryptState.reset()
    decryptState.setKeySize(newKeySize)
    decryptState.rawKey = key
  }

  if (from !== Tab.KeyExpansion && keyExpansionState.rawKey !== key) {
    keyExpansionState.reset()
    keyExpansionState.setKeySize(newKeySize)
    keyExpansionState.rawKey = key
  }
}