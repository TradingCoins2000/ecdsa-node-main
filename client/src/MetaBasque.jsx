import { useState } from "react";
function MetaBasque({ address, setAddress, balance, setBalance }) {
    async function onChange(evt) {
      const address = evt.target.value;
      setAddress(address);
      if (address) {
        const {
          data: { balance },
        } = await server.get(`balance/${address}`);
        setBalance(balance);
      } else {
        setBalance(0);
      }
    }
    const [visible,setVisible] = useState(true);
    function chageView(){
        setVisible(!visible);
    }
    return (
      <div className="container wallet">
        <h1>MetaBasque</h1>
  
        <label>
          Enter Private Key to Sign
          <input placeholder="Type private Key, for example: 1f34..." value={address} onChange={onChange}></input>
        </label>
      
        <div>
           <button className="button" onClick={chageView}>Sign & Transfer</button> 
        </div>

        
      </div>
    );
  }
  
  export default MetaBasque;