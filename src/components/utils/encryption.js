/**
 * Generate an encryption key.
 * Use something like ``generateKey().then((newKey) => setKey(newkey));``
 *
 * @returns A new encryption key.
 */
export const generateKey = async () => {
  const key = window.crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  return key;
};

/**
 * Encode a string to prepare for encryption.
 *
 * @param {String} dataStr The string to encode.
 * @returns The encoded value.
 */
const getDataEncoding = (dataStr) => {
  const encoder = new TextEncoder();
  return encoder.encode(dataStr);
};

/**
 * Encode and encrypt a string using a provided key.
 * Returns the Initialization Vector (IV) and the encrypted cipher text.
 *
 * @param {String} dataStr The string to encode and encrypt
 * @param {*} key The encryption key.
 * @returns IV and encrypted text (as 'ciphertext')
 */
export const encryptData = async (dataStr, key) => {
  const encoded = getDataEncoding(dataStr);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encoded
  );
  return { iv, ciphertext };
};

/**
 * Encode and encrypt a string using a provided key.
 * Returns the Initialization Vector (IV) and the encrypted cipher text.
 * The IV and cipher text are returned as a string of bytes.
 *
 * @param {String} dataStr The string to encode and encrypt
 * @param {*} key The encryption key.
 * @returns IV and encrypted text (as 'ciphertext')
 */
export const encryptDataToBytes = async (dataStr, key) => {
  const encoded = getDataEncoding(dataStr);
  const ivRaw = window.crypto.getRandomValues(new Uint8Array(12));
  const ciphertextRaw = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: ivRaw,
    },
    key,
    encoded
  );
  const iv = String.fromCharCode.apply(null, new Uint8Array(ivRaw));
  const ciphertext = String.fromCharCode.apply(
    null,
    new Uint8Array(ciphertextRaw)
  );
  return { iv, ciphertext };
};

/**
 * Convert a string of bytes to an ArrayBuffer.
 *
 * @param {String} bytesString A string of encrypted bytes.
 * @returns An ArrayBuffer representing the bytes.
 */
const stringToArray = (bytesString) => {
  let newBytesBuffer = new ArrayBuffer(bytesString.length);
  let bytesBufferView = new Uint8Array(newBytesBuffer);
  for (let i = 0; i < bytesString.length; i++) {
    bytesBufferView[i] = bytesString.charCodeAt(i);
  }
  return newBytesBuffer;
};

/**
 * Decrypt an encrypted encoding using the key and IV that were used for the
 * initial encryption.
 *
 * @param {*} key The Key that was used to encrypt the encoded string.
 * @param {*} iv The initialization vector from the encryption.
 * @param {*} ciphertext The encrypted encoding, to be decoded.
 * @returns The decoded string.
 */
export const decryptData = async (key, iv, ciphertext) => {
  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    ciphertext
  );
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
};

/**
 * Decrypt an encrypted encoding using the key and IV that were used for the
 * initial encryption. This implementation assumes that the IV and the cipher text
 * are both encoded as strings of bytes.
 *
 * @param {*} key The Key that was used to encrypt the encoded string.
 * @param {*} iv The initialization vector from the encryption.
 * @param {*} ciphertext The encrypted encoding, to be decoded.
 * @returns The decoded string.
 */
export const decryptDataFromBytes = async (key, ivBytes, ciphertextBytes) => {
  const ciphertext = stringToArray(ciphertextBytes);
  const iv = stringToArray(ivBytes);

  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    ciphertext
  );
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
};
