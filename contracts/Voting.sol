// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Voting {
    struct Candidate {
        string name;
        uint voteCount;
    }

    address public owner;
    Candidate[] public candidates;
    mapping(address => bool) public hasVoted;
    bool public votingEnded;

    event CandidateAdded(string name, uint candidateIndex);
    event VoteCast(address voter, uint candidateIndex);
    event VotingEnded(string winner);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    modifier votingActive() {
        require(!votingEnded, "Voting has ended");
        _;
    }

    modifier hasNotVoted() {
        require(!hasVoted[msg.sender], "You have already voted");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addCandidate(string memory name) public onlyOwner votingActive {
        require(bytes(name).length > 0, "Candidate name cannot be empty");
        candidates.push(Candidate(name, 0));
        emit CandidateAdded(name, candidates.length - 1);
    }

    function vote(uint candidateIndex) public votingActive hasNotVoted {
        require(candidateIndex < candidates.length, "Invalid candidate index");
        
        hasVoted[msg.sender] = true;
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

    function getVotingStatus() public view returns (bool) {
        return votingEnded;
    }
}
