import { customAlphabet } from "nanoid"

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export const getId = customAlphabet(alphabet, 10);