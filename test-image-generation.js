const { generateImageWithFallback } = require('./replicate');

async function testImageGeneration() {
  console.log('Testing Replicate image generation...');
  
  try {
    // Test with a simple prompt
    const testPrompt = "A beautiful sunset over mountains";
    console.log(`Testing with prompt: "${testPrompt}"`);
    
    const result = await generateImageWithFallback(testPrompt);
    
    console.log('Result:', result);
    
    if (result.success) {
      console.log('✅ Image generated successfully!');
      console.log('Image URL:', result.imageUrl);
    } else {
      console.log('❌ Image generation failed');
      console.log('Error:', result.error);
      console.log('Fallback URL:', result.imageUrl);
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testImageGeneration();
}

module.exports = { testImageGeneration };
