# Replicate Text-to-Image Integration Setup

This guide explains how to set up the Replicate API integration for text-to-image generation in your backend.

## Prerequisites

1. **Replicate Account**: Sign up at [replicate.com](https://replicate.com)
2. **API Token**: Get your API token from your Replicate dashboard

## Environment Variables

Add the following to your `.env` file:

```bash
# Replicate Configuration
REPLICATE_API_TOKEN=your_replicate_api_token_here
```

## How It Works

1. **Message Reception**: When a message comes in via Twilio (SMS or WhatsApp), the backend automatically generates an image from the text content.

2. **Image Generation**: Uses Replicate's Stable Diffusion model to create a 512x512 image based on the message text.

3. **Data Storage**: The generated image URL is stored in the database along with the original message.

4. **Frontend Display**: The frontend receives the image URL via Socket.IO and can display the generated image instead of just text.

## Cost Considerations

- **Stable Diffusion**: ~$0.002 per image generation
- **Alternative Models**: You can change the model in `replicate.js` to other cost-effective options
- **Fallback**: If image generation fails, a placeholder image is used

## Customization

### Change Image Model

Edit `replicate.js` to use different models:

```javascript
// For Kandinsky 2.2 (alternative model)
"ai-forever/kandinsky-2.2:ea1addaab376f4dc227f5368bbd8eff901820fd1cc14ed8cad63b29249e9d4631"

// For Stable Diffusion XL (higher quality, higher cost)
"stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b"
```

### Adjust Image Parameters

Modify the generation parameters in `replicate.js`:

```javascript
input: {
  prompt: prompt,
  width: 512,        // Image width
  height: 512,       // Image height
  num_outputs: 1,    // Number of images to generate
  guidance_scale: 7.5, // How closely to follow the prompt
  num_inference_steps: 20, // Quality vs speed tradeoff
}
```

## Error Handling

- **API Failures**: Automatic fallback to placeholder images
- **Rate Limiting**: Built-in error handling for API limits
- **Network Issues**: Graceful degradation with error logging

## Testing

1. Start your backend server
2. Send a message via Twilio
3. Check the console logs for image generation status
4. Verify the image URL is stored in the database
5. Check Socket.IO events for real-time updates

## Troubleshooting

- **API Token Issues**: Verify your Replicate API token is correct
- **Model Access**: Ensure you have access to the selected model
- **Rate Limits**: Check Replicate's rate limiting policies
- **Image Quality**: Adjust `num_inference_steps` for better quality (higher cost)
