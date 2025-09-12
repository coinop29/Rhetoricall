const Replicate = require("replicate");

// Initialize Replicate with API token from environment variables
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

/**
 * Generate an image from text using Replicate's Stable Diffusion model
 * @param {string} prompt - The text prompt to generate image from
 * @returns {Promise<string>} - The generated image URL
 */
const generateImageFromText = async (prompt) => {
  try {
    console.log(`Generating image for prompt: ${prompt}`);
    
    // Using a cost-effective Stable Diffusion model
    // You can change this to other models like:
    // - "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf"
    // - "ai-forever/kandinsky-2.2:ea1addaab376f4dc227f5368bbd8eff901820fd1cc14ed8cad63b29249e9d4631"
    const output = await replicate.run(
      "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
      {
        input: {
          prompt: prompt,
          width: 512,
          height: 512,
          num_outputs: 1,
          guidance_scale: 7.5,
          num_inference_steps: 20,
        }
      }
    );

    console.log(`Raw output from Replicate:`, output);
    
    // Handle different output formats
    let imageUrl;
    if (Array.isArray(output)) {
      imageUrl = output[0];
    } else if (typeof output === 'string') {
      imageUrl = output;
    } else if (output && output.toString) {
      imageUrl = output.toString();
    } else {
      throw new Error('Unexpected output format from Replicate');
    }

    // Ensure we have a valid URL string
    if (typeof imageUrl !== 'string') {
      throw new Error('Image URL is not a string');
    }

    console.log(`Image generated successfully: ${imageUrl}`);
    return imageUrl;
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error(`Failed to generate image: ${error.message}`);
  }
};

/**
 * Generate an image with a fallback to a default image if generation fails
 * @param {string} prompt - The text prompt
 * @returns {Promise<Object>} - Object containing image URL and generation status
 */
const generateImageWithFallback = async (prompt) => {
  try {
    const imageUrl = await generateImageFromText(prompt);
    return {
      success: true,
      imageUrl: imageUrl,
      prompt: prompt
    };
  } catch (error) {
    console.error("Image generation failed, using fallback:", error);
    // Return a default/placeholder image URL
    return {
      success: false,
      imageUrl: "https://via.placeholder.com/512x512/cccccc/666666?text=Image+Generation+Failed",
      prompt: prompt,
      error: error.message
    };
  }
};

module.exports = {
  generateImageFromText,
  generateImageWithFallback
};
