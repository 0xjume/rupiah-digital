import {
  TOKEN_2022_PROGRAM_ID,
  ExtensionType,
  getMintLen,
  createInitializeMintInstruction,
  createInitializeConfidentialTransferMintInstruction,
} from "@solana/spl-token";
import {
  Keypair,
  Connection,
  SystemProgram,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import fs from "fs";

// Load your devnet keypair
const payer = Keypair.fromSecretKey(
  Uint8Array.from(JSON.parse(fs.readFileSync("/Users/0xjume/Downloads/Turbin3/airdrop/Turbin3-wallet.json", "utf8")))
);

(async () => {
  const connection = new Connection("https://api.devnet.solana.com");

  // Prepare mint account
  const mintKeypair = Keypair.generate();
  const mintLen = getMintLen([ExtensionType.ConfidentialTransferMint]);
  const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);

  // 1. Allocate mint account
  const createAccountIx = SystemProgram.createAccount({
    fromPubkey: payer.publicKey,
    newAccountPubkey: mintKeypair.publicKey,
    space: mintLen,
    lamports,
    programId: TOKEN_2022_PROGRAM_ID,
  });

  // 2. Initialize mint
  const decimals = 6;
  const initializeMintIx = createInitializeMintInstruction(
    mintKeypair.publicKey,
    decimals,
    payer.publicKey,
    null,
    TOKEN_2022_PROGRAM_ID
  );

  // 3. Initialize confidential transfer extension
  const initializeConfidentialIx = createInitializeConfidentialTransferMintInstruction(
    mintKeypair.publicKey,
    payer.publicKey,
    0n, // auto-approve new accounts
    TOKEN_2022_PROGRAM_ID
  );

  const tx = new Transaction().add(createAccountIx, initializeMintIx, initializeConfidentialIx);
  const sig = await sendAndConfirmTransaction(connection, tx, [payer, mintKeypair]);
  console.log("Confidential mint created:", mintKeypair.publicKey.toBase58());
  console.log("Signature:", sig);
})();
