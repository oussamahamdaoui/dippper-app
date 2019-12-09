const crypto = require('crypto');

const generatePublicPrivateKey = () => new Promise((resolve, reject) => {
  crypto.generateKeyPair('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase: '',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  }, (error, publicKey, privateKey) => {
    if (error) {
      reject(error);
    }
    resolve({ publicKey, privateKey });
  });
});

const encrypt = (toEncrypt, publicKey) => {
  const buffer = Buffer.from(toEncrypt, 'utf8');
  const encrypted = crypto.publicEncrypt(publicKey, buffer);
  return encrypted.toString('base64');
};

const decrypt = (toDecrypt, privateKey) => {
  const buffer = Buffer.from(toDecrypt, 'base64');
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey,
      passphrase: '',
    },
    buffer,
  );
  return decrypted.toString('utf8');
};

const stringifyObject = (obj) => JSON.stringify(obj);

const verifySignature = (signature, data, publicKey) => {
  const verify = crypto.createVerify('SHA256');
  verify.update(stringifyObject(data));
  verify.end();
  return verify.verify(publicKey, signature, 'hex');
};

const generateSignature = (data, privateKey) => {
  const sign = crypto.createSign('SHA256');
  sign.update(stringifyObject(data));
  sign.end();
  const signature = sign.sign(privateKey, 'hex');
  return signature;
};

/**
     * Encrypts text by given key
     * @param String text to encrypt
     * @param Buffer masterkey
     * @returns String encrypted text, base64 encoded
     */
const encryptAES = (text, masterkey) => {
  const iv = crypto.randomBytes(16);
  const salt = crypto.randomBytes(64);
  const key = crypto.pbkdf2Sync(masterkey, salt, 2145, 32, 'sha512');
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(stringifyObject(text), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([salt, iv, tag, encrypted]).toString('base64');
};

/**
 * Decrypts text by given key
 * @param String base64 encoded input data
 * @param Buffer masterkey
 * @returns String decrypted (original) text
 */
const decryptAES = (data, masterkey) => {
  const bData = Buffer.from(data, 'base64');
  const salt = bData.slice(0, 64);
  const iv = bData.slice(64, 80);
  const tag = bData.slice(80, 96);
  const text = bData.slice(96);
  const key = crypto.pbkdf2Sync(masterkey, salt, 2145, 32, 'sha512');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const decrypted = decipher.update(text, 'binary', 'utf8') + decipher.final('utf8');
  return JSON.parse(decrypted);
};

const getPublicData = (message) => {
  const copy = { ...message };
  delete copy.data;
  delete copy.signature;
  return copy;
};

const createAndSignMessage = (data, senderPrivetKey) => {
  const masterKey = crypto.randomBytes(64).toString('hex');
  const encryptedMasterKeyTo = encrypt(masterKey, data.to);
  const encryptedMasterKeyFrom = encrypt(masterKey, data.from);
  const encryptedMessage = encryptAES(data.data, masterKey);
  const publicData = getPublicData(data);

  const signature = generateSignature({
    encryptedMasterKeyTo,
    encryptedMasterKeyFrom,
    encryptedMessage,
    ...publicData,
  }, senderPrivetKey);

  return {
    encryptedMasterKeyTo,
    encryptedMasterKeyFrom,
    encryptedMessage,
    ...publicData,
    signature,
  };
};

const decryptAndVerifyMessage = (data, recieverPrivetKey, recieverPublicKey) => {
  const noSignature = { ...data };
  delete noSignature.signature;


  if (verifySignature(data.signature, {
    ...noSignature,
  }, data.from)) {
    const encryptedMasterKey = data.from === recieverPublicKey
      ? data.encryptedMasterKeyFrom : data.encryptedMasterKeyTo;
    const decryptedMasterKey = decrypt(encryptedMasterKey, recieverPrivetKey);
    const decryptedMessage = decryptAES(data.encryptedMessage, decryptedMasterKey);

    delete noSignature.encryptedMasterKeyFrom;
    delete noSignature.encryptedMessage;
    delete noSignature.encryptedMasterKeyTo;

    return {
      ...noSignature,
      data: decryptedMessage,
    };
  }
  return null;
};


module.exports = {
  generateSignature,
  verifySignature,
  generatePublicPrivateKey,
  encrypt,
  decrypt,
  stringifyObject,
  encryptAES,
  decryptAES,
  createAndSignMessage,
  decryptAndVerifyMessage,
};
