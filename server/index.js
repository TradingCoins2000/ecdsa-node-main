const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const {
  hexToBytes,
  toHex,
  utf8ToBytes,
} = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0x9e8ad986a4fffca550de6fe0e98c4f686ee90b40": 1000, //genesis
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature, msgHash, pubKey, messagen } =
    req.body;
  //signature.recoverPublicKey(
  // msgHash: Uint8Array | string
  // )
  const isValid = secp256k1.verify(signature, msgHash, pubKey);
  realSender = toHex(getAddress(pubKey));
  const int = BigInt(`0x${realSender}`);
  //console.log("int" + int);
  console.log("messagen===>" + messagen);
  //message = hexToBytes(msgHash);
  console.log("real sender" + realSender);
  if (sender != int) {
    res.status(400).send({ message: "Not your wallet" });
  }

  //const recuperadaPublicKey = secp256k1.signature.recoverPublicKey(messagena);
  //const recupera = RecoverKey(signature);
  //console.log("recuperadaPublicKey" + recuperadaPublicKey);
  console.log("isValid" + isValid);
  console.log("msgHash" + msgHash);
  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

function getAddress(publicKey) {
  console.log("publicKey" + publicKey);
  const hashComplete = keccak256(hexToBytes(publicKey));

  return hashComplete.slice(-20);
}
