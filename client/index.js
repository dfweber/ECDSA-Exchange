import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./index.scss";

const EC = require("elliptic").ec;
import SHA256 from "crypto-js/sha256";

const App = () => {
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [allBalances, setAllBalances] = useState(null);
  const [amount, setAmount] = useState(null);
  const [recipient, setRecipient] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);
  const ec = new EC("secp256k1");

  function handleTransferAmount() {
    const transaction = {
      amount,
      recipient,
    };

    const key = ec.keyFromPrivate(privateKey, "hex");
    const signature = key.sign(SHA256(JSON.stringify(transaction)).toString());
    const body = JSON.stringify({
      transaction,
      signature: signature.toDER("hex"),
      publicKey: key.getPublic().encode("hex"),
    });

    const request = new Request(`http://localhost:3042/send`, {
      method: "POST",
      body,
    });

    fetch(request, { headers: { "Content-Type": "application/json" } })
      .then((response) => {
        return response.json();
      })
      .then(({ balance }) => {
        setBalance(balance);
      });
  }

  function handleGetBalances() {
    fetch("http://localhost:3042/balances")
      .then((response) => {
        return response.json();
      })
      .then(({ balances }) => {
        setAllBalances(balances);
      });
  }

  useEffect(() => {
    if (address === "" || address?.length < 16) {
      return null;
    }

    fetch(`http://localhost:3042/balance/${address}`)
      .then((response) => {
        return response.json();
      })
      .then(({ balance }) => {
        setBalance(balance);
      });
  }, [address]);

  useEffect(() => {
    handleGetBalances();
  }, []);

  return (
    <div>
      <div className="components">
        <div className="wallet">
          <h1>Your Wallet</h1>
          <input
            type="text"
            id="exchange-address"
            placeholder="Your Address"
            onChange={(e) => setAddress(e.target.value)}
          />
          <div id="balance">{balance}</div>
        </div>

        <div className="send">
          <h1>Send Amount</h1>
          <input
            type="text"
            id="private-key"
            placeholder="Private Key"
            onChange={(e) => setPrivateKey(e.target.value)}
          />
          <input
            type="text"
            id="send-amount"
            placeholder="Send Amount"
            onChange={(e) => setAmount(e.target.value)}
          />
          <input
            type="text"
            id="recipient"
            placeholder="Recipient"
            onChange={(e) => setRecipient(e.target.value)}
          />
          <div
            className="button"
            id="transfer-amount"
            onClick={() => {
              handleTransferAmount();
              handleGetBalances();
            }}
          >
            Transfer Amount
          </div>
        </div>
        <div>
          {allBalances &&
            Object.entries(allBalances).map((key) => (
              <>
                <p>
                  <b>address:</b> {key.toString().slice(0, 4)}...
                  {key[0].slice(-4)} <b>balance:</b> {key[1]}
                </p>
              </>
            ))}
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
