var randomize = require('randomatic')
var crypto = require('crypto')
const encode = require('nodejs-base64-encode')
// Refference: https://ciphertrick.com/2016/01/18/salt-hash-passwords-using-nodejs-crypto/

/**
 * generates random string of characters and numbers for password
 * @param {number} length - Length of the random string.
 */
const generatePassword = (passLength) => {
  let password = randomize('Aa0', passLength)
  return password
}

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
const generateSalt = (saltLength) => {
  let salt = crypto.randomBytes(Math.ceil(saltLength / 2))
    .toString('hex') /** convert to hexadecimal format */
    .slice(0, saltLength) /** return required number of characters */
  let base64Encode = encode.encode(salt, 'base64')
  return base64Encode
}

/**
 * hash password with sha512.
 * @function
 * @param {string} password - Generated password.
 * @param {string} salt - Generated Salt value.
 */
const computeHash = (password, salt) => {
  var hash = crypto.createHmac('sha512', salt) /** Hashing algorithm sha512 */
  hash.update(password)
  let hashValue = hash.digest('hex')
  return hashValue
}

module.exports = {
  generatePassword,
  generateSalt,
  computeHash
}
