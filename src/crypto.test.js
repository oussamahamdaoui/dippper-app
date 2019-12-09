const crypto = require('crypto');
const {
  generatePublicPrivateKey,
  verifySignature,
  generateSignature,
  encrypt,
  decrypt,
  stringifyObject,
  encryptAES,
  decryptAES,
  createAndSignMessage,
  decryptAndVerifyMessage,
} = require('./crypto');


test('test encription and decryption', async () => {
  const { publicKey, privateKey } = await generatePublicPrivateKey();

  const encrypted = encrypt('hello', publicKey);
  const decrypted = decrypt(encrypted, privateKey);
  expect(decrypted).toBe('hello');
});


test('test signature', async () => {
  const { publicKey, privateKey } = await generatePublicPrivateKey();
  const signature = generateSignature(publicKey, privateKey);
  const verifyedSignature = verifySignature(signature, publicKey, publicKey);
  expect(verifyedSignature).toBe(true);
});

test('stringify for signature shoud be concistent', () => {
  const ret = stringifyObject({
    c: '3',
    a: '1',
    b: '2',
  });
  expect(ret).toBe(JSON.stringify({
    c: '3',
    a: '1',
    b: '2',
  }));
});

test('AES encryption', () => {
  const message = 'hello';
  const masterKey = crypto.randomBytes(64).toString('hex');
  const encrypted = encryptAES(message, masterKey);
  expect(decryptAES(encrypted, masterKey)).toBe('hello');
});


test('message encription', async () => {
  const alice = await generatePublicPrivateKey();
  const bob = await generatePublicPrivateKey();

  const message = {
    data: 'hey',
    from: bob.publicKey,
    to: alice.publicKey,
    date: (new Date()).getTime(),
  };

  const e = decryptAndVerifyMessage(
    createAndSignMessage(message, bob.privateKey), alice.privateKey, alice.publicKey,
  );

  const e2 = decryptAndVerifyMessage(
    createAndSignMessage(message, bob.privateKey), bob.privateKey, bob.publicKey,
  );

  expect(e).toEqual(message);
  expect(e2).toEqual(message);
});
