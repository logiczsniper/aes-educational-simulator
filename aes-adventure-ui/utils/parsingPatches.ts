// This file contains patches for toJSON and fromJSON to be used by 
// JSON.stringify and JSON.parse which in turn
// is used by pinia-persistedstate to store values in localstorage.

function toJSON(this: Uint8Array) {
  return Object.values(this)
}

; (Uint8Array.prototype as any).toJSON = toJSON;