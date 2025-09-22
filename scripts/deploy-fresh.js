const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("Deploying fresh Voting contract...");

  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.deploy();

  await voting.deployed();

  const contractAddress = voting.address;
  console.log("Voting contract deployed to:", contractAddress);
  console.log("Contract owner:", await voting.owner());

  // Save contract address and ABI for backend use
  const contractInfo = {
    address: contractAddress,
    abi: Voting.interface.format("json")
  };

  fs.writeFileSync(
    './contract-info.json',
    JSON.stringify(contractInfo, null, 2)
  );

  console.log("Contract info saved to contract-info.json");
  console.log("\n🚀 Ready to test! Run the following commands:");
  console.log("1. cd backend && node server.js");
  console.log("2. node test-workflow.js");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

