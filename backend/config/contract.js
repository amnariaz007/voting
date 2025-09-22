// Contract configuration
const CONTRACT_CONFIG = {
  address: '0x36034B11b6Dd92dC41c4f59B907B5855C6222Fb9',
  abi: [
    {"inputs":[],"stateMutability":"nonpayable","type":"constructor"},
    {"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"uint256","name":"candidateIndex","type":"uint256"}],"name":"CandidateAdded","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"voter","type":"address"},{"indexed":false,"internalType":"uint256","name":"candidateIndex","type":"uint256"}],"name":"VoteCast","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"winner","type":"string"}],"name":"VotingEnded","type":"event"},
    {"inputs":[{"internalType":"string","name":"name","type":"string"}],"name":"addCandidate","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"candidates","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"voteCount","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"endVoting","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"getCandidateCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"getCandidates","outputs":[{"components":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"voteCount","type":"uint256"}],"internalType":"struct Voting.Candidate[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"getVotingStatus","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"getWinner","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"hasVoted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"candidateIndex","type":"uint256"}],"name":"vote","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"votingEnded","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}
  ],
  ownerAccount: '0x13922310EEB17f2d210818919D7B9548339F43b6',
  privateKey: '10f9897e12c358a28284fbcf1bd4747617c120e82adea55cf0df0b8ed140744c',
  rpcUrl: 'https://ethereum-holesky.publicnode.com'
};

module.exports = CONTRACT_CONFIG;
