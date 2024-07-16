const express = require("express");
const fs = require("fs");
const path = require("path");
const Joi = require("@hapi/joi");

const { checkPhoneNumber } = require("./db");
const { request } = require("express");
const { initTwilio } = require("./twilio");
const BackgroundVideo = require("./models/background");

console.log(BackgroundVideo.find({}), "BackgroundVideo");
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
      console.log("here is called ======>", req.file);
      const fileUrl = `${process.env.REACT_APP_BACKEND_URL}static/${req.file.filename}`;
      const background = new BackgroundVideo({
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
    const backgrounds = await BackgroundVideo.find({});
    res.status(200).json(backgrounds);
  } catch (error) {
    console.error("Error in /api/backgrounds:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Set default background
router.post("/api/set_default", async (req, res) => {
  const { _id } = req.body;
  try {
    // Unset previous default background
    await BackgroundVideo.updateMany(
      { isDefault: true },
      { $set: { isDefault: false } }
    );

    // Set new default background
    await BackgroundVideo.findByIdAndUpdate(_id, { isDefault: true });

    res.status(200).json({ message: "Default background set successfully" });
  } catch (error) {
    console.error("Error in /api/set_default:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get default background
router.get("/api/get_default", async (req, res) => {
  try {
    const defaultBackground = await BackgroundVideo.findOne({
      isDefault: true,
    });

    if (!defaultBackground) {
      return res.status(404).json({ error: "Default background not found" });
    }

    res.status(200).json(defaultBackground);
  } catch (error) {
    console.error("Error in /api/get_default:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Remove background
router.post("/api/delete", async (req, res) => {
  const { _id } = req.body;
  try {
    const background = await BackgroundVideo.findByIdAndDelete(_id);

    if (!background) {
      return res.status(404).json({ error: "Background not found" });
    }

    // Optionally, remove the file from the server
    const filePath = path.join(__dirname, "public", background.filename);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      } else {
        console.log("File deleted:", filePath);
      }
    });

    res.status(200).json({ message: "Background removed successfully" });
  } catch (error) {
    console.error("Error in /api/delete:", error);
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
