# Voting Backend Server

A Node.js backend server that integrates with the Voting smart contract deployed on a local Hardhat network.

## Features

- RESTful API endpoints for voting operations
- Web3.js integration with Ethereum smart contract
- Comprehensive error handling and validation
- Request logging with Morgan
- CORS support for frontend integration

## API Endpoints

### POST /candidates
Add a new candidate (owner only)
```json
{
  "name": "Candidate Name"
}
```

### GET /candidates
Get all candidates with their vote counts
```json
{
  "success": true,
  "candidates": [
    {
      "index": 0,
      "name": "Alice",
      "voteCount": 5
    }
  ],
  "totalCandidates": 1
}
```

### POST /vote
Cast a vote for a candidate
```json
{
  "address": "0x...",
  "candidateIndex": 0
}
```

### GET /winner
Get the winner (only after voting ends)
```json
{
  "success": true,
  "winner": "Alice",
  "votingEnded": true
}
```

### POST /end-voting
End the voting process (owner only)

### GET /status
Get current voting status and contract info

### GET /health
Health check endpoint

## Setup

1. Make sure Hardhat node is running: `npx hardhat node`
2. Deploy the contract: `npx hardhat run scripts/deploy.js --network localhost`
3. Start the backend: `npm start`

## Configuration

The server automatically loads contract information from `../contract-info.json` which is generated during contract deployment.

