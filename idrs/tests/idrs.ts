import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Idrs } from "../target/types/idrs";
import { SystemProgram, Keypair, PublicKey, Connection, Transaction } from "@solana/web3.js";
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";

// Add this helper function for mint account creation with Confidential Transfer extension
async function createConfidentialMint(connection: Connection, payer: Keypair): Promise<Keypair> {
  // Replace with actual lengths from Rust if different
  const MINT_SIZE = 82 + 97; // spl_token_2022::state::Mint::LEN + ConfidentialTransferMint::get_packed_len()
  const mint = Keypair.generate();
  const lamports = await connection.getMinimumBalanceForRentExemption(MINT_SIZE);

  const createMintIx = SystemProgram.createAccount({
    fromPubkey: payer.publicKey,
    newAccountPubkey: mint.publicKey,
    lamports,
    space: MINT_SIZE,
    programId: TOKEN_2022_PROGRAM_ID,
  });

  const tx = new Transaction().add(createMintIx);
  await anchor.AnchorProvider.env().sendAndConfirm(tx, [payer, mint]);
  return mint;
}

describe("idrs", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.idrs as Program<Idrs>;
  const provider = anchor.AnchorProvider.env();
  const connection = provider.connection;
  const payer = provider.wallet.payer;

  it("Creates confidential mint account", async () => {
    const mint = await createConfidentialMint(connection, payer);
    console.log("Confidential mint created:", mint.publicKey.toBase58());
    // You can now call the initialize instruction with this mint
  });

  it("Initializes confidential mint via Anchor", async () => {
    const mint = await createConfidentialMint(connection, payer);
    const mintAuthority = payer.publicKey;

    // Call the initialize instruction
    const tx = await program.methods
      .initialize(6) // 6 decimals for IDR
      .accounts({
        payer: payer.publicKey,
        mint: mint.publicKey,
        mintAuthority: mintAuthority,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([payer])
      .rpc();
    console.log("Initialized confidential mint via Anchor, tx:", tx);
  });

  it("Mints confidential $IDRS tokens", async () => {
    // Implement mint_to test here (requires confidential token account setup)
    // Example:
    // const tx = await program.methods.mintTo(amount).accounts({...}).signers([...]).rpc();
    // console.log("Minted confidential $IDRS, tx:", tx);
  });

  it("Burns confidential $IDRS tokens", async () => {
    // Implement burn test here (requires confidential token account setup)
    // Example:
    // const tx = await program.methods.burn(amount).accounts({...}).signers([...]).rpc();
    // console.log("Burned confidential $IDRS, tx:", tx);
  });

  it("Performs confidential transfer", async () => {
    // Implement confidential_transfer test here (requires confidential token accounts and ZK proof setup)
    // Example:
    // const tx = await program.methods.confidentialTransfer(encryptedAmount).accounts({...}).signers([...]).rpc();
    // console.log("Confidential transfer, tx:", tx);
  });

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
