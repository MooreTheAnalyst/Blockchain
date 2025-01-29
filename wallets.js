// Import bip39 and bip32
import * as bip39 from "bip39";
import * as ecc from "tiny-secp256k1";
import { BIP32Factory } from "bip32";

// Create a BIP32 instance
const bip32 = BIP32Factory(ecc);

// Generate a random mnemonic phrase
function generateMnemonic() {
  const mnemonic = bip39.generateMnemonic();
  console.log("Generated mnemonic:", mnemonic);
  return mnemonic;
}
generateMnemonic();

// Derive seed from mnemonic
function getSeedFromMnemonic(mnemonic) {
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  console.log("Derived seed:", seed.toString("hex"));
  return seed;
}
getSeedFromMnemonic();

// Create a root node from the seed
function getRootNodeFromSeed(seed) {
  const root = bip32.fromSeed(seed);
  console.log("Root Node:", root);
  return root;
}

// Derive Accounts
function deriveAccounts(root, count) {
  const accounts = [];
  for (let i = 0; i < count; i++) {
    const path = `m/44'/60'/0'/0/${i}`;
    const child = root.derivePath(path);

    if (!child.privateKey || !child.publicKey) {
      throw new Error(`Failed to derive keys for path ${path}`);
    }
    const account = {
      path,
      privateKey: Buffer.from(child.privateKey).toString("hex"),
      publicKey: Buffer.from(child.publicKey).toString("hex"),
    };
    accounts.push(account);
  }
  return accounts;
}

// Function that generates a mnemonic phrase, derives a seed, and creates multiple accounts
function generateBlockchainAccounts(numAccounts) {
  // Generate a mnemonic phrase
  const mnemonic = generateMnemonic();

  // Derive a seed from the mnemonic phrase
  const seed = getSeedFromMnemonic(mnemonic);

  // Create a root node from the seed
  const root = getRootNodeFromSeed(seed);

  // Derive multiple accounts from the root seed
  const accounts = deriveAccounts(root, numAccounts);

  return { mnemonic, accounts };
}

// Generate and display accounts
const blockchainAccounts = generateBlockchainAccounts(2);
console.log("Mnemonic Phrase:", blockchainAccounts.mnemonic);
console.log("Generated Accounts:", blockchainAccounts.accounts);
