// Simple test to check API responses
const http = require('http');

function testDownloadAPI() {
  const options = {
    hostname: 'localhost',
    port: 3005,
    path: '/api/packet-capture/download?file=test_capture_1758790327.pcap',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log(`Response length: ${data.length}`);
      if (res.statusCode === 200) {
        console.log('✓ Download API is working');
        // Save the file
        const fs = require('fs');
        fs.writeFileSync('test_download.pcap', data, 'binary');
        console.log('File saved as test_download.pcap');
      } else {
        console.log('✗ Download API failed:', data);
      }
    });
  });

  req.on('error', (e) => {
    console.error(`Request error: ${e.message}`);
  });

  req.end();
}

testDownloadAPI();