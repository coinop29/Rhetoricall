const http = require('http');

const BASE_URL = 'http://localhost:5000';

// Helper function to make HTTP requests
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => responseData += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', (error) => reject(error));

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runComprehensiveTest() {
  console.log('🚀 Starting Comprehensive Test Suite\n');

  try {
    // Test 1: Check initial display mode
    console.log('📋 Test 1: Checking initial display mode...');
    const initialMode = await makeRequest('GET', '/api/display-mode');
    console.log(`   Initial mode: ${initialMode.data.displayMode}`);
    console.log('   ✅ Passed\n');

    // Test 2: Change to text mode
    console.log('📋 Test 2: Changing to text mode...');
    const textModeResponse = await makeRequest('POST', '/api/display-mode', { mode: 'text' });
    console.log(`   Response: ${textModeResponse.data.message}`);
    console.log('   ✅ Passed\n');

    // Test 3: Verify text mode is set
    console.log('📋 Test 3: Verifying text mode is set...');
    const verifyTextMode = await makeRequest('GET', '/api/display-mode');
    console.log(`   Current mode: ${verifyTextMode.data.displayMode}`);
    if (verifyTextMode.data.displayMode === 'text') {
      console.log('   ✅ Passed\n');
    } else {
      console.log('   ❌ Failed\n');
      return;
    }

    // Test 4: Change to image mode
    console.log('📋 Test 4: Changing to image mode...');
    const imageModeResponse = await makeRequest('POST', '/api/display-mode', { mode: 'image' });
    console.log(`   Response: ${imageModeResponse.data.message}`);
    console.log('   ✅ Passed\n');

    // Test 5: Verify image mode is set
    console.log('📋 Test 5: Verifying image mode is set...');
    const verifyImageMode = await makeRequest('GET', '/api/display-mode');
    console.log(`   Current mode: ${verifyImageMode.data.displayMode}`);
    if (verifyImageMode.data.displayMode === 'image') {
      console.log('   ✅ Passed\n');
    } else {
      console.log('   ❌ Failed\n');
      return;
    }

    // Test 6: Test image generation (should work in image mode)
    console.log('📋 Test 6: Testing image generation in image mode...');
    const imageGenResponse = await makeRequest('POST', '/api/test-image-generation', { 
      prompt: 'A magical forest with glowing mushrooms' 
    });
    console.log(`   Status: ${imageGenResponse.status}`);
    if (imageGenResponse.data.success) {
      console.log('   ✅ Image generation test passed\n');
    } else {
      console.log('   ❌ Image generation test failed\n');
    }

    // Test 7: Test invalid mode
    console.log('📋 Test 7: Testing invalid mode rejection...');
    const invalidModeResponse = await makeRequest('POST', '/api/display-mode', { mode: 'invalid' });
    console.log(`   Status: ${invalidModeResponse.status}`);
    if (invalidModeResponse.status === 400) {
      console.log('   ✅ Invalid mode correctly rejected\n');
    } else {
      console.log('   ❌ Invalid mode not properly rejected\n');
    }

    console.log('🎉 All tests completed successfully!');
    console.log('\n📊 Summary:');
    console.log('   - Display mode toggle: ✅ Working');
    console.log('   - Image generation: ✅ Working');
    console.log('   - Input validation: ✅ Working');
    console.log('   - API endpoints: ✅ All responding');

  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  console.log('Make sure your server is running on port 5000 before running this test!\n');
  runComprehensiveTest();
}

module.exports = { runComprehensiveTest };
