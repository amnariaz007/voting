// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Voting {
    struct Candidate {
        string name;
        uint voteCount;
    }

    address public owner;
    Candidate[] public candidates;
    mapping(address => uint) public lastVotingRound;
    uint public currentVotingRound;
    bool public votingEnded;

    event CandidateAdded(string name, uint candidateIndex);
    event VoteCast(address voter, uint candidateIndex);
    event VotingEnded(string winner);
    event VotingStarted();
    event VotingReset();

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    modifier votingActive() {
        require(!votingEnded, "Voting has ended");
        _;
    }

    modifier hasNotVoted() {
        require(lastVotingRound[msg.sender] != currentVotingRound, "You have already voted in this round");
        _;
    }

    constructor() {
        owner = msg.sender;
        currentVotingRound = 1; // Start with round 1 so new addresses can vote
    }

    function addCandidate(string memory name) public onlyOwner votingActive {
        require(bytes(name).length > 0, "Candidate name cannot be empty");
        candidates.push(Candidate(name, 0));
        emit CandidateAdded(name, candidates.length - 1);
    }

    function vote(uint candidateIndex) public votingActive hasNotVoted {
        require(candidateIndex < candidates.length, "Invalid candidate index");
        
        lastVotingRound[msg.sender] = currentVotingRound;
        candidates[candidateIndex].voteCount++;
        
        emit VoteCast(msg.sender, candidateIndex);
    }

    function getCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }

    function getCandidateCount() public view returns (uint) {
        return candidates.length;
    }

    function getWinner() public view returns (string memory) {
        require(votingEnded, "Voting has not ended yet");
        require(candidates.length > 0, "No candidates available");
        
        uint maxVotes = 0;
        uint winnerIndex = 0;
        
        for (uint i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > maxVotes) {
                maxVotes = candidates[i].voteCount;
                winnerIndex = i;
            }
        }
        
        return candidates[winnerIndex].name;
    }

    function endVoting() public onlyOwner {
        require(!votingEnded, "Voting has already ended");
        votingEnded = true;
        
        string memory winner = getWinner();
        emit VotingEnded(winner);
    }

    function startVoting() public onlyOwner {
        require(votingEnded, "Voting is already active");
        votingEnded = false;
        emit VotingStarted();
    }

    function resetVoting() public onlyOwner {
        // Reset all vote counts to 0
        for (uint i = 0; i < candidates.length; i++) {
            candidates[i].voteCount = 0;
        }
        
        // Increment voting round to allow previous voters to vote again
        currentVotingRound++;
        
        // Reset voting status
        votingEnded = false;
        
        emit VotingReset();
    }

    function getVotingStatus() public view returns (bool) {
        return votingEnded;
    }

    function getCurrentVotingRound() public view returns (uint) {
        return currentVotingRound;
    }
}
