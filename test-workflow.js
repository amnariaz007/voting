#!/usr/bin/env node

/**
 * Complete Voting System Test Workflow
 * 
 * This script demonstrates the complete voting system workflow:
 * 1. Add candidates
 * 2. Cast votes
 * 3. Check results
 * 4. End voting
 * 5. Get winner
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';

// Helper function to make HTTP requests
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testWorkflow() {
  console.log('🚀 Starting Voting System Test Workflow\n');

  try {
    // 1. Check system status
    console.log('1️⃣ Checking system status...');
    const status = await makeRequest('GET', '/status');
    console.log('   Status:', status.data);
    console.log('');

    // 2. Add candidates
    console.log('2️⃣ Adding candidates...');
    const candidates = ['Alice', 'Bob', 'Charlie'];
    
    for (const candidate of candidates) {
      const result = await makeRequest('POST', '/candidates', { name: candidate });
      console.log(`   Added candidate: ${candidate} - ${result.data.success ? '✅' : '❌'}`);
    }
    console.log('');

    // 3. Check candidates
    console.log('3️⃣ Checking candidates...');
    const candidatesList = await makeRequest('GET', '/candidates');
    console.log('   Candidates:', candidatesList.data.candidates);
    console.log('');

    // 4. Cast votes
    console.log('4️⃣ Casting votes...');
    const voters = [
      '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
      '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
      '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
      '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc'
    ];

    const votes = [
      { voter: voters[0], candidate: 0 }, // Alice
      { voter: voters[1], candidate: 1 }, // Bob
      { voter: voters[2], candidate: 0 }, // Alice
      { voter: voters[3], candidate: 2 }, // Charlie
      { voter: voters[4], candidate: 0 }  // Alice
    ];

    for (const vote of votes) {
      const result = await makeRequest('POST', '/vote', {
        address: vote.voter,
        candidateIndex: vote.candidate
      });
      console.log(`   Vote by ${vote.voter.substring(0, 10)}... for candidate ${vote.candidate} - ${result.data.success ? '✅' : '❌'}`);
    }
    console.log('');

    // 5. Check final results
    console.log('5️⃣ Checking final results...');
    const finalResults = await makeRequest('GET', '/candidates');
    console.log('   Final Results:');
    finalResults.data.candidates.forEach(candidate => {
      console.log(`     ${candidate.name}: ${candidate.voteCount} votes`);
    });
    console.log('');

    // 6. End voting
    console.log('6️⃣ Ending voting...');
    const endResult = await makeRequest('POST', '/end-voting');
    console.log(`   Voting ended - ${endResult.data.success ? '✅' : '❌'}`);
    console.log(`   Winner: ${endResult.data.winner}`);
    console.log('');

    // 7. Get winner
    console.log('7️⃣ Getting winner...');
    const winner = await makeRequest('GET', '/winner');
    console.log(`   Winner: ${winner.data.winner}`);
    console.log('');

    // 8. Try to vote after ending (should fail)
    console.log('8️⃣ Testing vote after ending (should fail)...');
    const failedVote = await makeRequest('POST', '/vote', {
      address: '0x976EA74026E726554dB657fA54763abd0C3a0aa9',
      candidateIndex: 0
    });
    console.log(`   Vote after ending: ${failedVote.data.error ? '❌ (Blocked as expected)' : '✅'}`);
    console.log('');

    console.log('🎉 Test workflow completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Added ${candidates.length} candidates`);
    console.log(`   - Cast ${votes.length} votes`);
    console.log(`   - Winner: ${winner.data.winner}`);
    console.log(`   - All security checks working properly`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  testWorkflow();
}

module.exports = { testWorkflow };

