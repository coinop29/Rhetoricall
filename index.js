const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = express();
const http = require("http").Server(app);
require("dotenv").config();
const { init, insertItem, checkPhoneNumber } = require("./db");
const { initTwilio } = require("./twilio");
const routes = require("./routes");
const { MessagingResponse } = require("twilio").twiml;
const urlBodyParser = express.urlencoded({ extended: false });
const Joi = require("@hapi/joi");
// const Filter = require("bad-words");
// const filter = new Filter();

const FilterHacked = require("./bad-words-hacked"); // Import the custom filter
const filter = new FilterHacked();

const { clean } = require("profanity-cleaner");
const { generateImageWithFallback } = require("./replicate");

// Global display mode setting (can be 'text' or 'image')
let globalDisplayMode = 'image'; // Default to image mode

var corsOptions = {
  origin: "*",
};

const PORT = process.env.PORT || 5000;

const itemSchema = Joi.object().keys({
  sid: Joi.string(),
  from: Joi.string(),
  to: Joi.string(),
  body: Joi.string(),
  filtered: Joi.string(),
  imageUrl: Joi.string().optional(),
  imageGenerationStatus: Joi.string().optional(),
  imagePrompt: Joi.string().optional(),
  displayMode: Joi.string().valid('text', 'image').default('image'),
});

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(routes);
app.use("/static", express.static(path.join(__dirname, "public")));

// Initialize Twilio and other services
init();
initTwilio();

// Connect to MongoDB
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

// Event listeners for mongoose connection
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});

// Add WebSocket endpoint for frontend compatibility
app.get("/ws", (req, res) => {
  res.status(200).send("WebSocket endpoint ready");
});

// Add WebSocket upgrade endpoint
app.get("/ws/", (req, res) => {
  res.status(200).send("WebSocket endpoint ready");
});

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("new connection");
  
  // Send current display mode to newly connected clients
  socket.emit("displayModeChanged", { mode: globalDisplayMode });
  
  socket.on("history", (msg) => {
    io.emit("historyChanged", msg);
    console.log("history changed emitted");
  });
  
  // Handle display mode change requests from clients
  socket.on("setDisplayMode", (data) => {
    if (data.mode && ['text', 'image'].includes(data.mode)) {
      globalDisplayMode = data.mode;
      console.log(`Display mode changed via socket to: ${globalDisplayMode}`);
      io.emit("displayModeChanged", { mode: globalDisplayMode });
    }
  });
});

app.get("/", (req, res) => {
  res.status(200).send("Hello, World!");
});

// Health check endpoint for Railway
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development"
  });
});

// Test endpoint for image generation
app.post("/api/test-image-generation", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    console.log(`Testing image generation for prompt: ${prompt}`);
    const imageResult = await generateImageWithFallback(prompt);
    
    res.json({
      success: true,
      result: imageResult,
      message: "Image generation test completed"
    });
  } catch (error) {
    console.error("Test image generation failed:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get current display mode
app.get("/api/display-mode", (req, res) => {
  res.json({
    success: true,
    displayMode: globalDisplayMode
  });
});

// Set display mode
app.post("/api/display-mode", async (req, res) => {
  try {
    const { mode } = req.body;
    
    if (!mode || !['text', 'image'].includes(mode)) {
      return res.status(400).json({ 
        error: "Mode must be either 'text' or 'image'" 
      });
    }

    globalDisplayMode = mode;
    console.log(`Display mode changed to: ${mode}`);
    
    // Emit the change to all connected clients
    io.emit("displayModeChanged", { mode: globalDisplayMode });
    
    res.json({
      success: true,
      displayMode: globalDisplayMode,
      message: `Display mode changed to ${mode}`
    });
  } catch (error) {
    console.error("Error setting display mode:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post("/api/messageIncoming", urlBodyParser, async (req, res) => {
  console.log("request =========>", req);
  console.log("request body =========>", req.body);
  const twiml = new MessagingResponse();
  // AccountSid, NumMedia, NumSegments, RefferralNumMedia, , FromCity, FromCountry, FromState, FromZip, MessageSid, SmsMessageSid, ToCity, ToCountry, Tostate, ToZip, SmsStatus
  const { Body, From, SmsSid, To } = req.body;
  
  try {
    let item;
    
    if (globalDisplayMode === 'image') {
      // Generate image from the message text
      const imageResult = await generateImageWithFallback(Body);
      
      item = {
        sid: SmsSid,
        from: From,
        to: To,
        body: Body,
        filtered: clean(Body),
        imageUrl: imageResult.imageUrl,
        imageGenerationStatus: imageResult.success ? "success" : "failed",
        imagePrompt: imageResult.prompt,
        displayMode: 'image',
      };
    } else {
      // Text-only mode - no image generation
      item = {
        sid: SmsSid,
        from: From,
        to: To,
        body: Body,
        filtered: clean(Body),
        imageUrl: null,
        imageGenerationStatus: 'skipped',
        imagePrompt: Body,
        displayMode: 'text',
      };
    }

    const result = itemSchema.validate(item);
    console.log("result ======>", result, item);
    if (result.error) {
      twiml.message("Invalid data type");
      res.type("text/xml").send(twiml.toString());
      return;
    }
    
    const isExists = await checkPhoneNumber(item.from);

    insertItem(item)
      .then(() => {
        console.log("item saved with image");
        io.emit("messageIncoming", item);
        if (isExists) {
          res.status(200).send("success");
        } else {
          twiml.message("Thanks for your contribution! Image generated.");
          res.type("text/xml").send(twiml.toString());
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(500).end();
      });
  } catch (error) {
    console.error("Error processing message:", error);
    // Fallback to original behavior if image generation fails completely
    const item = {
      sid: SmsSid,
      from: From,
      to: To,
      body: Body,
      filtered: clean(Body),
      imageUrl: "https://via.placeholder.com/512x512/cccccc/666666?text=Processing+Error",
      imageGenerationStatus: "error",
      imagePrompt: Body,
    };

    const result = itemSchema.validate(item);
    if (result.error) {
      twiml.message("Invalid data type");
      res.type("text/xml").send(twiml.toString());
      return;
    }

    const isExists = await checkPhoneNumber(item.from);
    insertItem(item)
      .then(() => {
        console.log("item saved with error fallback");
        io.emit("messageIncoming", item);
        if (isExists) {
          res.status(200).send("success");
        } else {
          twiml.message("Thanks for your contribution!");
          res.type("text/xml").send(twiml.toString());
        }
      })
      .catch((insertError) => {
        console.log(insertError);
        res.status(500).end();
      });
  }
});

app.post("/api/whatsAppMessageIncoming", urlBodyParser, async (req, res) => {
  console.log("request =========>", req);
  console.log("request body =========>", req.body);
  const twiml = new MessagingResponse();
  // AccountSid, NumMedia, NumSegments, RefferralNumMedia, , FromCity, FromCountry, FromState, FromZip, MessageSid, SmsMessageSid, ToCity, ToCountry, Tostate, ToZip, SmsStatus
  const { Body, From, SmsSid, To } = req.body;
  
  try {
    let item;
    
    if (globalDisplayMode === 'image') {
      // Generate image from the message text
      const imageResult = await generateImageWithFallback(Body);
      
      item = {
        sid: SmsSid,
        from: From,
        to: To,
        body: Body,
        filtered: clean(Body),
        imageUrl: imageResult.imageUrl,
        imageGenerationStatus: imageResult.success ? "success" : "failed",
        imagePrompt: imageResult.prompt,
        displayMode: 'image',
      };
    } else {
      // Text-only mode - no image generation
      item = {
        sid: SmsSid,
        from: From,
        to: To,
        body: Body,
        filtered: clean(Body),
        imageUrl: null,
        imageGenerationStatus: 'skipped',
        imagePrompt: Body,
        displayMode: 'text',
      };
    }

    const result = itemSchema.validate(item);
    console.log("result ======>", result, item);
    if (result.error) {
      twiml.message("Invalid data type");
      res.type("text/xml").send(twiml.toString());
      return;
    }
    
    const isExists = await checkPhoneNumber(item.from);

    insertItem(item)
      .then(() => {
        console.log("item saved with image");
        io.emit("messageIncoming", item);
        if (isExists) {
          res.status(200).send("success");
        } else {
          twiml.message("Thanks for your contribution! Image generated.");
          res.type("text/xml").send(twiml.toString());
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(500).end();
      });
  } catch (error) {
    console.error("Error processing WhatsApp message:", error);
    // Fallback to original behavior if image generation fails completely
    const item = {
      sid: SmsSid,
      from: From,
      to: To,
      body: Body,
      filtered: clean(Body),
      imageUrl: "https://via.placeholder.com/512x512/cccccc/666666?text=Processing+Error",
      imageGenerationStatus: "error",
      imagePrompt: Body,
    };

    const result = itemSchema.validate(item);
    if (result.error) {
      twiml.message("Invalid data type");
      res.type("text/xml").send(twiml.toString());
      return;
    }

    const isExists = await checkPhoneNumber(item.from);
    insertItem(item)
      .then(() => {
        console.log("item saved with error fallback");
        io.emit("messageIncoming", item);
        if (isExists) {
          res.status(200).send("success");
        } else {
          twiml.message("Thanks for your contribution!");
          res.type("text/xml").send(twiml.toString());
        }
      })
      .catch((insertError) => {
        console.log(insertError);
        res.status(500).end();
      });
  }
});

server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
