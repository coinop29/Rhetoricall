const express = require("express");
const fs = require("fs");
const path = require("path");
const Joi = require("@hapi/joi");

const { checkPhoneNumber } = require("./db");
const { request } = require("express");
const { initTwilio } = require("./twilio");
const Background = require("./models/background");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(path.join(__dirname, "/public")))
      fs.mkdirSync(path.join(__dirname, "/public"));
    cb(null, path.join(__dirname, "/public"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

const jsonBodyParser = express.json();
const router = express.Router();

// router.post(
//   "/api/upload",
//   upload.single("backgroundFile"),
//   async (req, res) => {
//     try {
//       console.log("here is called ======>", req.file);
//       res.send(req.file.filename).status(200).end();
//     } catch (error) {
//       console.error("Error in /api/upload:", error);
//       res.status(500).json({ error: "Internal Server Error" }).end();
//     }
//   }
// );

router.post(
  "/api/upload",
  upload.single("backgroundFile"),
  async (req, res) => {
    try {
      const fileUrl = `${process.env.REACT_APP_BACKEND_URL}static/${req.file.filename}`;
      const background = new Background({
        url: fileUrl,
        filename: req.file.filename,
      });
      await background.save();
      res.status(200).json({ url: fileUrl, filename: req.file.filename });
    } catch (error) {
      console.error("Error in /api/upload:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get("/api/backgrounds", async (req, res) => {
  try {
    const backgrounds = await Background.find();
    res.status(200).json(backgrounds);
  } catch (error) {
    console.error("Error in /api/backgrounds:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/api/load", jsonBodyParser, async (req, res) => {
  try {
    const data = await initTwilio();
    res.json({ data }).end();
  } catch (error) {
    console.error("Error in /api/load:", error);
    res.status(500).json({ error: "Internal Server Error" }).end();
  }
});

module.exports = router;
