#!/bin/bash
# Confidential Transfer Test Script

# Configuration
TOKEN_MINT="F56au8BXsvrWcDx3qai7JfojcS1DCdZ7pz4DZ4P8rA3L"
TOKEN_PROGRAM="TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
RECIPIENT_KEYPAIR="/Users/0xjume/Downloads/IDRS/test-recipient.json"
RECIPIENT_PUBKEY="7oZumQES6DFujGeUmTGqN3zNpb5Yqsmu1UVh8rB39vLo"
RECIPIENT_TOKEN_ACCOUNT="GqCXLuiAYgWEuhrJHD1tTF7YHjXE6skNWS6EcwQa7qEL"
SOURCE_TOKEN_ACCOUNT="ApDmu5jKmUikqtttmMmtifw5bBesGzNSETnPEQPPpknx"

echo "===== Step 1: Check if source account has confidential transfers enabled ====="
spl-token display --program-id $TOKEN_PROGRAM $SOURCE_TOKEN_ACCOUNT

echo -e "\n===== Step 2: Enable confidential credits on source account ====="
echo "Run this command if not already enabled:"
echo "spl-token enable-confidential-credits --program-id $TOKEN_PROGRAM $SOURCE_TOKEN_ACCOUNT"

echo -e "\n===== Step 3: Enable confidential credits on destination account ====="
echo "Run this command:"
echo "spl-token enable-confidential-credits --program-id $TOKEN_PROGRAM $RECIPIENT_TOKEN_ACCOUNT"

echo -e "\n===== Step 4: Perform confidential transfer ====="
echo "Run this command to transfer 100 tokens confidentially:"
echo "spl-token transfer --program-id $TOKEN_PROGRAM $TOKEN_MINT 100 $RECIPIENT_TOKEN_ACCOUNT --confidential"

echo -e "\n===== Step 5: Check balances ====="
echo "Run these commands to check balances (note: confidential balances may not show accurately):"
echo "spl-token balance --program-id $TOKEN_PROGRAM $TOKEN_MINT"
echo "spl-token balance --program-id $TOKEN_PROGRAM $TOKEN_MINT --owner $RECIPIENT_PUBKEY"
