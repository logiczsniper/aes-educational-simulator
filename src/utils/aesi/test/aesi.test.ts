import { expect, test, describe } from 'vitest'
import { aesi } from '../aesi'
import { TEST_VECTORS } from './vectors'

describe('AESi', () => {
  TEST_VECTORS.map(({ label, plaintext, key, ciphertext }) => {
    test(label, () => {
      const { encrypt, decrypt } = aesi({ key, config: {} })

      console.log(encrypt(plaintext))

      expect(encrypt(plaintext).block.toString()).toBe(ciphertext.toString())
      expect(decrypt(ciphertext).block.toString()).toBe(plaintext.toString())
    })
  })
})
