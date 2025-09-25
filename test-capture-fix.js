// Test script to verify packet capture file handling
const fs = require('fs');
const path = require('path');

// Check if temp directory exists
const tempDir = path.join(__dirname, 'temp');
console.log('Temp directory path:', tempDir);
console.log('Temp directory exists:', fs.existsSync(tempDir));

if (fs.existsSync(tempDir)) {
  // List all pcap files in temp directory
  const files = fs.readdirSync(tempDir).filter(file => file.endsWith('.pcap'));
  console.log('PCAP files in temp directory:', files);
  
  // Show details of each file
  files.forEach(file => {
    const filePath = path.join(tempDir, file);
    const stats = fs.statSync(filePath);
    console.log(`File: ${file}`);
    console.log(`  Size: ${stats.size} bytes`);
    console.log(`  Modified: ${stats.mtime}`);
    console.log(`  Full path: ${filePath}`);
  });
} else {
  console.log('Creating temp directory...');
  fs.mkdirSync(tempDir, { recursive: true });
  console.log('Temp directory created');
}

// Test the API endpoints
const axios = require('axios');

async function testAPIs() {
  try {
    console.log('\n=== Testing API Endpoints ===');
    
    // Test interfaces endpoint
    console.log('Testing /api/packet-capture/interfaces...');
    const interfacesResponse = await axios.get('http://localhost:3005/api/packet-capture/interfaces');
    console.log('Interfaces response:', interfacesResponse.data);
    
    // Test stats endpoint (with dummy session)
    console.log('\nTesting /api/packet-capture/stats...');
    try {
      const statsResponse = await axios.post('http://localhost:3005/api/packet-capture/stats', {
        sessionId: 'test_session'
      });
      console.log('Stats response:', statsResponse.data);
    } catch (error) {
      console.log('Stats error (expected for dummy session):', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error('API test failed:', error.message);
  }
}

// Run the test
testAPIs();