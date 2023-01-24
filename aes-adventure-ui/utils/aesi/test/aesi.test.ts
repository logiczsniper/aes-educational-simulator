import { expect, test, describe } from 'vitest'
import { aesi } from '../aesi'

import { TEST_VECTOR_DECRYPT_128 } from './decrypt128'
import { TEST_VECTOR_DECRYPT_192 } from './decrypt192'
import { TEST_VECTOR_DECRYPT_256 } from './decrypt256'
import { TEST_VECTOR_ENCRYPT_128 } from './encrypt128'
import { TEST_VECTOR_ENCRYPT_192 } from './encrypt192'
import { TEST_VECTOR_ENCRYPT_256 } from './encrypt256'


/**
 * Test vectors include every Known Answer Test (KAT) from NIST's
 * Advanced Encryption Standard Algorithm Validation Suite (AESAVS):
 * 
 * https://csrc.nist.gov/CSRC/media/Projects/Cryptographic-Algorithm-Validation-Program/documents/aes/AESAVS.pdf
 */
describe('AESi', () => {
  TEST_VECTOR_ENCRYPT_128.map(({ label, plaintext, key, ciphertext }, index) => {
    test(`${label} VECTOR: ${index}`, () => {
      const { encrypt } = aesi({ key, config: {} })

      expect(encrypt(plaintext).block.toString()).toBe(ciphertext.toString())
    })
  })

  TEST_VECTOR_DECRYPT_128.map(({ label, plaintext, key, ciphertext }, index) => {
    test(`${label} VECTOR: ${index}`, () => {
      const { decrypt } = aesi({ key, config: {} })

      expect(decrypt(ciphertext).block.toString()).toBe(plaintext.toString())
    })
  })

  TEST_VECTOR_ENCRYPT_192.map(({ label, plaintext, key, ciphertext }, index) => {
    test(`${label} VECTOR: ${index}`, () => {
      const { encrypt } = aesi({ key, config: {} })

      expect(encrypt(plaintext).block.toString()).toBe(ciphertext.toString())
    })
  })

  TEST_VECTOR_DECRYPT_192.map(({ label, plaintext, key, ciphertext }, index) => {
    test(`${label} VECTOR: ${index}`, () => {
      const { decrypt } = aesi({ key, config: {} })

      expect(decrypt(ciphertext).block.toString()).toBe(plaintext.toString())
    })
  })

  TEST_VECTOR_ENCRYPT_256.map(({ label, plaintext, key, ciphertext }, index) => {
    test(`${label} VECTOR: ${index}`, () => {
      const { encrypt } = aesi({ key, config: {} })

      expect(encrypt(plaintext).block.toString()).toBe(ciphertext.toString())
    })
  })

  TEST_VECTOR_DECRYPT_256.map(({ label, plaintext, key, ciphertext }, index) => {
    test(`${label} VECTOR: ${index}`, () => {
      const { decrypt } = aesi({ key, config: {} })

      expect(decrypt(ciphertext).block.toString()).toBe(plaintext.toString())
    })
  })
})
