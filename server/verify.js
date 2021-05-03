const EC = require("elliptic").ec;
const SHA256 = require("crypto-js/sha256");

const ec = new EC("secp256k1");

const verify = (publicKey) => {
  console.log("+++++++++> ", publicKey);
  // TODO: fill in the public key points
  //   const publicKey = {
  //     x: "",
  //     y: "",
  //   };

  const key = ec.keyFromPublic(publicKey, "hex");

  // TODO: change this message to whatever was signed
  const msg = "I am in the ChainShot Bootcamp";
  const msgHash = SHA256(msg);

  const signature = key.sign(msgHash.toString());

  console.log(signature);
  //   console.log("====> , signature");

  // TODO: fill in the signature components
  const fullSignature = {
    // r: signature.r.toString(16),
    // s: signature.s.toString(16),
  };

  //   console.log(key.verify(msgHash, fullSignature));
};

exports.verify = verify;
