import { useState } from "react";
import server from "./server";
import * as secp from '@noble/secp256k1';
import { hexToBytes, toHex, utf8ToBytes } from "ethereum-cryptography/utils.js";
// PrivateKey
// 0a4408cf3cd738bc5f37dcca708c9a0e2ad1879557f1f45a3db0ce57ed0867fa
// 6dde25d1e4b3ceaa3405cd6e186933065dc081c06dc64336b3c5ab49ab1f2c68
// 48613d08bcd214656d0831a15ad6ee535d100b9ac8ca162976d2ff85f906d7c0


// Public key
// 04fe30f00103218d8677f01616196f4ea3afbef8958d1aff5d98e2b9a0a1441a012d6a1a0b4acb761d0e0a1c5979d7ae42820b3e7b8b7bfa589ad844335886416b
// 044e97027b02e7c632bf67f8bd4d1605fcd88c5a1a016a88bac4f925e0f19f49075c6ff6cf6ecc4a9ea62cdf4b38d99fb4d677d2e78a03f64de1f00d2f319eed5e
// 04bd00ed678edefa66ba045541dfa5da3e820f47371fa85651589fd55d1869975c79c6ca6102c9cd8724b4149c23f30f14050323e074f5282958e44a4505a5dd88


// Address:
// 0x6bcb66f001e844935aa96ce3a4817b78c7f99fad
// 0x9e8ad986a4fffca550de6fe0e98c4f686ee90b40
// 0xf72c7820d9039159834d1d25cb4df030dc5c1c8e

function Transfer({ address, setBalance }) {

  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [visible,setVisible] = useState(false);

  const setValue = (setter) => (evt) => setter(evt.target.value);
  
  function chageView(evt){
    evt.preventDefault();
    setVisible(!visible);
}


  async function transfer(evt) {
    evt.preventDefault();
    setVisible(!visible);
    
    try {
    const messagen =utf8ToBytes( address+"/"+recipient+"="+sendAmount);
    
    const msgHash = await secp.utils.sha256(messagen);
    const [signature,recoveryBit] = await secp.sign(msgHash, privateKey, { recovered: true });
    const pubKey = secp.getPublicKey(privateKey);
    const isValid = secp.verify(signature, msgHash, pubKey);
    console.log("msgHash==>", msgHash);
    console.log("recoveryBit==>", recoveryBit);
    console.log("messagen==>", messagen);
    
    setPrivateKey("");
 
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient: recipient,
        msgHash: toHex(msgHash),
        signature:toHex(signature),
        pubKey: toHex(pubKey), 
        messagen: toHex(messagen),
       });
      setBalance(balance);
    } catch (ex) {
      alert("Error: " + ex.message);
    }
  }

  return (
    <div>
    
    <form className="container transfer" onSubmit={chageView}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient) }
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
{(visible) ? 
  
    <div className="container wallet">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 48 48" id="metamask"><path fill="#000" fill-rule="evenodd" d="M2.50896 2.0106C2.56128 1.99409 2.61714 1.99711 2.66661 2.01798L17.7573 7.64911H30.2426L45.3153 2.01775C45.3645 1.99712 45.4201 1.99416 45.4721 2.01052C45.542 2.03246 45.5971 2.08654 45.6203 2.15595L47.9882 9.22212C48.001 9.26054 48.0035 9.3017 47.9952 9.34137L46.44 16.8064L47.3125 17.4649C47.3696 17.508 47.4032 17.5753 47.4034 17.6468C47.4036 17.7183 47.3703 17.7858 47.3134 17.8291L46.0584 18.7861L46.9791 19.4989C47.0325 19.5402 47.0649 19.6029 47.0676 19.6704C47.0703 19.7378 47.0431 19.803 46.9933 19.8484L45.7097 21.0197L46.4134 21.5263C46.4654 21.5637 46.4993 21.6212 46.5069 21.6848C46.5144 21.7484 46.495 21.8122 46.4533 21.8608L44.3741 24.2804L47.613 34.2548C47.6223 34.2799 47.627 34.3065 47.6271 34.3332C47.6271 34.3419 47.6266 34.3507 47.6256 34.3594C47.6239 34.3751 47.6205 34.3906 47.6156 34.4056L44.5787 44.7085C44.5435 44.8281 44.419 44.8974 44.2989 44.8643L33.8419 41.9872L31.8821 43.5907C31.8773 43.5946 31.8724 43.5983 31.8674 43.6018L27.6911 46.4916C27.6529 46.5181 27.6075 46.5323 27.561 46.5323H20.4203C20.3736 46.5323 20.3281 46.518 20.2898 46.4914L16.1322 43.6015C16.1273 43.5981 16.1225 43.5945 16.1179 43.5907L14.1581 41.9872L3.70106 44.8643C3.58076 44.8974 3.45615 44.8279 3.42107 44.7082L0.403037 34.4059C0.39536 34.3827 0.391456 34.3583 0.39148 34.3339C0.391454 34.3073 0.396052 34.281 0.405063 34.256L3.60766 24.2801L1.54611 21.86C1.5047 21.8114 1.48552 21.7477 1.4932 21.6843C1.50088 21.6209 1.53473 21.5636 1.58656 21.5263L2.29025 21.0197L1.00672 19.8484C0.957106 19.8032 0.929915 19.7384 0.932365 19.6713C0.934815 19.6041 0.966659 19.5415 1.01944 19.5L1.92485 18.7875L0.667951 17.8291C0.610805 17.7856 0.577478 17.7176 0.577978 17.6458C0.578478 17.5739 0.612745 17.5065 0.670492 17.4637L1.55973 16.805L0.0048045 9.34137C-0.00342225 9.30188 -0.00105275 9.26092 0.0116724 9.22264L2.36085 2.15646C2.38397 2.0869 2.43906 2.03266 2.50896 2.0106ZM20.6027 38.8699L20.2396 39.0472L19.8203 42.7542C19.8095 42.8499 19.8597 42.942 19.9459 42.9847C20.0321 43.0275 20.1359 43.0116 20.2054 42.9451L20.5679 42.5983H27.4188L27.8202 42.9515C27.8914 43.0142 27.9939 43.0264 28.0778 42.9821C28.1617 42.9379 28.2096 42.8464 28.1981 42.7522L27.7456 39.0486L27.379 38.8701C27.3649 38.8642 27.3513 38.8568 27.3383 38.8478L26.5016 38.2727H21.4796L20.643 38.8478C20.6301 38.8567 20.6166 38.864 20.6027 38.8699ZM32.444 30.0928L29.4792 28.7437L28.2487 31.3232L32.444 30.0928ZM15.5737 30.0931L18.5384 28.7442L19.754 31.3235L15.5737 30.0931Z" clip-rule="evenodd"></path></svg>
        <h1>MetaBasque</h1>
        <label>
          Enter Private Key to Sign
          <input placeholder="Type private Key, for example: 1f34..."
          onChange={setValue(setPrivateKey)}
          ></input>
        </label>
        <div>
           <button className="button" onClick={transfer} >Sign & Transfer</button> 
        </div>
        <div>
           <button className="button2" onClick={chageView} >Cancel</button> 
        </div>
        
      </div>
  : null}

  </div>
  );
}

export default Transfer;
