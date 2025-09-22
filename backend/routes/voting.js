const express = require('express');
const { Web3 } = require('web3');
const router = express.Router();

// Import contract configuration
const CONTRACT_CONFIG = require('../config/contract');

// Initialize Web3 and contract
const web3 = new Web3(CONTRACT_CONFIG.rpcUrl);
const contract = new web3.eth.Contract(CONTRACT_CONFIG.abi, CONTRACT_CONFIG.address);

// Create account from private key
const account = web3.eth.accounts.privateKeyToAccount('0x' + CONTRACT_CONFIG.privateKey);
web3.eth.accounts.wallet.add(account);

// Validation middleware
const validateAddress = (req, res, next) => {
  const { address } = req.body;
  if (!address || !web3.utils.isAddress(address)) {
    return res.status(400).json({ error: 'Valid Ethereum address is required' });
  }
  next();
};

// POST /candidates - Add a candidate (only owner)
router.post('/candidates', async (req, res, next) => {
  try {
    const { name } = req.body;
    
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Candidate name is required and must be a non-empty string' });
    }

    console.log(`Adding candidate: ${name}`);
    
    const result = await contract.methods.addCandidate(name.trim()).send({
      from: CONTRACT_CONFIG.ownerAccount,
      gas: 300000
    });

    console.log(`Candidate added successfully. Transaction hash: ${result.transactionHash}`);
    
    res.json({ 
      success: true, 
      message: 'Candidate added successfully',
      transactionHash: result.transactionHash,
      candidateName: name.trim()
    });
  } catch (error) {
    next(error);
  }
});

// GET /candidates - List all candidates and their vote counts
router.get('/candidates', async (req, res, next) => {
  try {
    console.log('Fetching all candidates...');
    
    const candidates = await contract.methods.getCandidates().call();
    
    const formattedCandidates = candidates.map((candidate, index) => ({
      index: index,
      name: candidate.name,
      voteCount: parseInt(candidate.voteCount)
    }));

    console.log(`Found ${formattedCandidates.length} candidates`);
    
    res.json({
      success: true,
      candidates: formattedCandidates,
      totalCandidates: formattedCandidates.length
    });
  } catch (error) {
    next(error);
  }
});

// POST /vote - Cast a vote for a candidate
router.post('/vote', validateAddress, async (req, res, next) => {
  try {
    const { address, candidateIndex } = req.body;
    
    if (candidateIndex === undefined || candidateIndex === null) {
      return res.status(400).json({ error: 'Candidate index is required' });
    }

    const index = parseInt(candidateIndex);
    if (isNaN(index) || index < 0) {
      return res.status(400).json({ error: 'Candidate index must be a valid non-negative number' });
    }

    console.log(`Voting for candidate ${index} by address ${address}`);
    
    // Check if voting has ended
    const votingEnded = await contract.methods.getVotingStatus().call();
    if (votingEnded) {
      return res.status(400).json({ error: 'Voting has ended' });
    }

    // Check if user has already voted in current round
    try {
      const lastVotingRound = await contract.methods.lastVotingRound(address).call();
      const currentVotingRound = await contract.methods.getCurrentVotingRound().call();
      if (parseInt(lastVotingRound) === parseInt(currentVotingRound)) {
        return res.status(400).json({ error: 'You have already voted in this round' });
      }
    } catch (error) {
      console.log('Error checking voting round, proceeding with vote:', error.message);
      // Continue with voting if we can't check voting round status
    }

    // Get candidate count to validate index
    const candidateCount = await contract.methods.getCandidateCount().call();
    if (index >= candidateCount) {
      return res.status(400).json({ error: 'Invalid candidate index' });
    }

    const result = await contract.methods.vote(index).send({
      from: address,
      gas: 300000
    });

    console.log(`Vote cast successfully. Transaction hash: ${result.transactionHash}`);
    
    res.json({ 
      success: true, 
      message: 'Vote cast successfully',
      transactionHash: result.transactionHash,
      candidateIndex: index,
      voterAddress: address
    });
  } catch (error) {
    next(error);
  }
});

// GET /winner - Return the winner's name
router.get('/winner', async (req, res, next) => {
  try {
    console.log('Fetching winner...');
    
    const votingEnded = await contract.methods.getVotingStatus().call();
    if (!votingEnded) {
      return res.status(400).json({ error: 'Voting has not ended yet' });
    }

    const winner = await contract.methods.getWinner().call();
    
    console.log(`Winner: ${winner}`);
    
    res.json({
      success: true,
      winner: winner,
      votingEnded: true
    });
  } catch (error) {
    next(error);
  }
});

// POST /end-voting - End voting (only owner)
router.post('/end-voting', async (req, res, next) => {
  try {
    console.log('Ending voting...');
    
    const votingEnded = await contract.methods.getVotingStatus().call();
    if (votingEnded) {
      return res.status(400).json({ error: 'Voting has already ended' });
    }

    const result = await contract.methods.endVoting().send({
      from: CONTRACT_CONFIG.ownerAccount,
      gas: 300000
    });

    const winner = await contract.methods.getWinner().call();

    console.log(`Voting ended successfully. Winner: ${winner}. Transaction hash: ${result.transactionHash}`);
    
    res.json({ 
      success: true, 
      message: 'Voting ended successfully',
      winner: winner,
      transactionHash: result.transactionHash
    });
  } catch (error) {
    next(error);
  }
});

// POST /start-voting - Start voting (only owner)
router.post('/start-voting', async (req, res, next) => {
  try {
    console.log('Starting voting...');
    
    const votingEnded = await contract.methods.getVotingStatus().call();
    if (!votingEnded) {
      return res.status(400).json({ error: 'Voting is already active' });
    }

    const result = await contract.methods.startVoting().send({
      from: CONTRACT_CONFIG.ownerAccount,
      gas: 300000
    });

    console.log(`Voting started successfully. Transaction hash: ${result.transactionHash}`);
    
    res.json({ 
      success: true, 
      message: 'Voting started successfully',
      transactionHash: result.transactionHash
    });
  } catch (error) {
    next(error);
  }
});

// POST /reset-voting - Reset voting (only owner)
router.post('/reset-voting', async (req, res, next) => {
  try {
    console.log('Resetting voting...');
    
    const result = await contract.methods.resetVoting().send({
      from: CONTRACT_CONFIG.ownerAccount,
      gas: 300000
    });

    console.log(`Voting reset successfully. Transaction hash: ${result.transactionHash}`);
    
    res.json({ 
      success: true, 
      message: 'Voting reset successfully - all vote counts cleared and voting restarted',
      transactionHash: result.transactionHash
    });
  } catch (error) {
    next(error);
  }
});

// GET /status - Get voting status and contract info
router.get('/status', async (req, res, next) => {
  try {
    const votingEnded = await contract.methods.getVotingStatus().call();
    const candidateCount = await contract.methods.getCandidateCount().call();
    const owner = await contract.methods.owner().call();
    
    res.json({
      success: true,
      votingEnded: votingEnded,
      candidateCount: parseInt(candidateCount),
      contractAddress: CONTRACT_CONFIG.address,
      owner: owner
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
