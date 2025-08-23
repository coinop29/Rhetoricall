// Test script for image integration functionality
// This file can be used to test the new image handling capabilities

import { 
  isImageMessage, 
  getImageUrl, 
  getTextContent, 
  processIncomingMessage,
  getDisplayMode,
  getImageGenerationStatus
} from './utils/messageUtils';

// Test cases
const testCases = [
  // Text message tests
  {
    name: 'Simple text message',
    input: 'Hello World',
    expected: {
      type: 'text',
      text: 'Hello World',
      isImage: false
    }
  },
  
  // Image message tests
  {
    name: 'Direct image URL',
    input: 'https://example.com/image.jpg',
    expected: {
      type: 'image',
      imageUrl: 'https://example.com/image.jpg',
      isImage: true
    }
  },
  
  {
    name: 'Legacy structured image message',
    input: {
      type: 'image',
      imageUrl: 'https://replicate.com/generated-image.png',
      text: 'A beautiful sunset over mountains',
      timestamp: 1234567890
    },
    expected: {
      type: 'image',
      imageUrl: 'https://replicate.com/generated-image.png',
      text: 'A beautiful sunset over mountains',
      isImage: true
    }
  },

  // New backend structure tests
  {
    name: 'New backend structure - successful image generation',
    input: {
      sid: 'SM1234567890',
      from: '+1234567890',
      body: 'Generate a beautiful sunset',
      imageUrl: 'https://replicate.com/sunset.jpg',
      imageGenerationStatus: 'success',
      displayMode: 'image',
      timestamp: 1234567890
    },
    expected: {
      type: 'image',
      text: 'Generate a beautiful sunset',
      imageUrl: 'https://replicate.com/sunset.jpg',
      isImage: true,
      displayMode: 'image',
      imageGenerationStatus: 'success'
    }
  },

  {
    name: 'New backend structure - failed image generation',
    input: {
      sid: 'SM1234567890',
      from: '+1234567890',
      body: 'Generate a beautiful sunset',
      imageUrl: null,
      imageGenerationStatus: 'failed',
      displayMode: 'image',
      timestamp: 1234567890
    },
    expected: {
      type: 'text',
      text: 'Generate a beautiful sunset',
      imageUrl: null,
      isImage: false,
      displayMode: 'image',
      imageGenerationStatus: 'failed'
    }
  },

  {
    name: 'New backend structure - text mode message',
    input: {
      sid: 'SM1234567890',
      from: '+1234567890',
      body: 'Hello, this is a text message',
      imageUrl: null,
      imageGenerationStatus: 'skipped',
      displayMode: 'text',
      timestamp: 1234567890
    },
    expected: {
      type: 'text',
      text: 'Hello, this is a text message',
      imageUrl: null,
      isImage: false,
      displayMode: 'text',
      imageGenerationStatus: 'skipped'
    }
  },
  
  // Edge cases
  {
    name: 'Empty message',
    input: '',
    expected: {
      type: 'text',
      text: '',
      isImage: false
    }
  },
  
  {
    name: 'Null message',
    input: null,
    expected: {
      type: 'text',
      text: 'Unknown message type',
      isImage: false
    }
  }
];

// Run tests
function runTests() {
  console.log('🧪 Running Image Integration Tests...\n');
  
  let passed = 0;
  let failed = 0;
  
  testCases.forEach((testCase, index) => {
    console.log(`Test ${index + 1}: ${testCase.name}`);
    
    try {
      const result = processIncomingMessage(testCase.input);
      const isImageResult = isImageMessage(testCase.input);
      const displayMode = getDisplayMode(testCase.input);
      const imageStatus = getImageGenerationStatus(testCase.input);
      
      // Check if type matches
      const typeMatch = result.type === testCase.expected.type;
      
      // Check if image detection matches
      const imageMatch = isImageResult === testCase.expected.isImage;
      
      // Check if text content matches
      const textMatch = result.text === testCase.expected.text;
      
      // Check if image URL matches (for image messages)
      let imageUrlMatch = true;
      if (testCase.expected.isImage) {
        const actualUrl = getImageUrl(testCase.input);
        imageUrlMatch = actualUrl === testCase.expected.imageUrl;
      }
      
      // Check display mode
      const displayModeMatch = displayMode === testCase.expected.displayMode;
      
      // Check image generation status
      const statusMatch = imageStatus === testCase.expected.imageGenerationStatus;
      
      if (typeMatch && imageMatch && textMatch && imageUrlMatch && displayModeMatch && statusMatch) {
        console.log('✅ PASSED');
        passed++;
      } else {
        console.log('❌ FAILED');
        console.log('  Expected:', testCase.expected);
        console.log('  Got:', {
          type: result.type,
          text: result.text,
          isImage: isImageResult,
          imageUrl: getImageUrl(testCase.input),
          displayMode: displayMode,
          imageGenerationStatus: imageStatus
        });
        failed++;
      }
    } catch (error) {
      console.log('❌ FAILED with error:', error.message);
      failed++;
    }
    
    console.log('');
  });
  
  // Summary
  console.log('📊 Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! Image integration is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the implementation.');
  }
}

// Export for use in other files
export { runTests, testCases };

// Run tests if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment
  window.runImageIntegrationTests = runTests;
} else {
  // Node.js environment
  runTests();
}
