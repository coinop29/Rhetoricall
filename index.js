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

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("new connection");
  socket.on("history", (msg) => {
    io.emit("historyChanged", msg);
    console.log("history changed emitted");
  });
});

app.get("/", (req, res) => {
  res.status(200).send("Hello, World!");
});

app.post("/api/messageIncoming", urlBodyParser, async (req, res) => {
  console.log("request =========>", req);
  console.log("request body =========>", req.body);
  const twiml = new MessagingResponse();
  // AccountSid, NumMedia, NumSegments, RefferralNumMedia, , FromCity, FromCountry, FromState, FromZip, MessageSid, SmsMessageSid, ToCity, ToCountry, Tostate, ToZip, SmsStatus
  const { Body, From, SmsSid, To } = req.body;
  // try{
  // const filteredBody=filter.clean(Body),
  const item = {
    sid: SmsSid,
    from: From,
    to: To,
    body: Body,
    filtered: filter.clean(Body),
  };

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
      console.log("item saved");
      io.emit("messageIncoming", item);
      if (isExists) {
        res.status(200).send("success");
      } else {
        twiml.message("Thanks for your contribution!");
        res.type("text/xml").send(twiml.toString());
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).end();
    });
});

server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
