export const duplicatePlaintext = () => {
  const encryptState = useEncryptState()
  const decryptState = useDecryptState()

  const plaintext = decryptState.outputString

  if (encryptState.rawPlaintext !== plaintext) {
    encryptState.reset()
    encryptState.rawPlaintext = plaintext
  }
}