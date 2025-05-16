import React, { useEffect, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";

const MINT_ADDRESS = "F56au8BXsvrWcDx3qai7JfojcS1DCdZ7pz4DZ4P8rA3L";
const TOKEN_PROGRAM_ID = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
const DEVNET = "https://api.devnet.solana.com";

function App() {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [balance, setBalance] = useState<string>("");
  const [recipient, setRecipient] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  // Connect Phantom wallet
  const connectWallet = async () => {
    // @ts-ignore
    if (window.solana && window.solana.isPhantom) {
      try {
        // @ts-ignore
        const resp = await window.solana.connect();
        setWalletAddress(resp.publicKey.toString());
      } catch (err) {
        setStatus("Wallet connection failed");
      }
    } else {
      setStatus("Phantom wallet not found");
    }
  };

  // Fetch SPL token balance for connected wallet
  const fetchBalance = async () => {
    if (!walletAddress) return;
    setStatus("Fetching balance...");
    try {
      const connection = new Connection(DEVNET);
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        new PublicKey(walletAddress),
        { mint: new PublicKey(MINT_ADDRESS) }
      );
      if (tokenAccounts.value.length > 0) {
        const bal = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmountString;
        setBalance(bal);
      } else {
        setBalance("0");
      }
      setStatus("");
    } catch (e) {
      setStatus("Failed to fetch balance");
    }
  };

  // Transfer tokens (non-confidential, for demo)
  const transferToken = async () => {
    setStatus("Transfer not implemented in this demo. Use CLI for confidential transfers.");
  };

  useEffect(() => {
    if (walletAddress) fetchBalance();
    // eslint-disable-next-line
  }, [walletAddress]);

  return (
    <div style={{ maxWidth: 480, margin: "40px auto", padding: 24, border: "1px solid #eee", borderRadius: 12, background: "#fafbfc" }}>
      <h2>IDRS Token Dashboard</h2>
      <button onClick={connectWallet} style={{ marginBottom: 16 }}>
        {walletAddress ? "Wallet Connected" : "Connect Phantom Wallet"}
      </button>
      {walletAddress && (
        <>
          <div><b>Your Wallet:</b> <span style={{ fontSize: 13 }}>{walletAddress}</span></div>
          <div style={{ margin: "12px 0" }}>
            <b>IDRS Balance:</b> {balance}
            <button style={{ marginLeft: 8 }} onClick={fetchBalance}>Refresh</button>
          </div>
          <hr style={{ margin: "16px 0" }} />
          <h4>Send IDRS</h4>
          <input
            style={{ width: "100%", marginBottom: 8 }}
            type="text"
            placeholder="Recipient Address"
            value={recipient}
            onChange={e => setRecipient(e.target.value)}
          />
          <input
            style={{ width: "100%", marginBottom: 8 }}
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
          <button onClick={transferToken} style={{ width: "100%" }}>
            Send (Demo Only)
          </button>
        </>
      )}
      <div style={{ color: "#c00", marginTop: 16 }}>{status}</div>
      <div style={{ fontSize: 13, color: "#888", marginTop: 32 }}>
        <div>Token Mint: <span style={{ fontSize: 12 }}>{MINT_ADDRESS}</span></div>
        <div>Program: <span style={{ fontSize: 12 }}>{TOKEN_PROGRAM_ID}</span></div>
        <div>Network: devnet</div>
      </div>
    </div>
  );
}

export default App;
