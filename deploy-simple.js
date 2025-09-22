const { ethers } = require("ethers");

async function main() {
  // Connect to Holesky testnet
  const provider = new ethers.providers.JsonRpcProvider("https://ethereum-holesky.publicnode.com");
  
  // Create wallet from private key
  const wallet = new ethers.Wallet("0x10f9897e12c358a28284fbcf1bd4747617c120e82adea55cf0df0b8ed140744c", provider);
  
  console.log("Deploying from address:", wallet.address);
  
  // Contract bytecode and ABI (you'll need to get this from Remix)
  console.log("Please deploy the contract manually using Remix IDE:");
  console.log("1. Go to https://remix.ethereum.org");
  console.log("2. Create Voting.sol file");
  console.log("3. Copy your contract code");
  console.log("4. Compile with Solidity 0.8.19");
  console.log("5. Deploy to Holesky testnet");
  console.log("6. Use your wallet address:", wallet.address);
  console.log("7. Copy the new contract address");
}

main().catch(console.error);
