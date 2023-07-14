import CryptoJS from 'crypto-js'

const secretKey = process.env.ACCESS_TOKEN_SECRET

const encryptValue = (dataEncrypt: string): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(dataEncrypt), secretKey).toString()
}

const decodeValue: (_: string) => string = (payload: string) => {
  let decryptedData = ''
  try {
    const bytes = CryptoJS.AES.decrypt(payload, secretKey)
    decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
  } catch (error) {
    throw Error('Error during decryption')
  }
  return decryptedData
}

export { encryptValue, decodeValue }
