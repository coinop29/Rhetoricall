const express = require("express");
const fs = require('fs');
const path = require('path');
const Joi = require("@hapi/joi");

const { checkPhoneNumber } = require("./db");
const { request } = require("express");
const { initTwilio } = require("./twilio");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if(!fs.existsSync(path.join(__dirname, '/public'))) fs.mkdirSync(path.join(__dirname, '/public'));
    cb(null,path.join(__dirname,'/public'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

const jsonBodyParser = express.json();
const router = express.Router();

router.post("/api/load", jsonBodyParser, async (req, res) => {
  const data = await initTwilio();
  res.json({ data }).end();
});

router.post(
  "/api/upload",
  upload.single("backgroundFile"),
  async (req, res) => {
    console.log("here is called ======>", req.file);
    res.send(req.file.filename).status(200).end();
  }
);

module.exports = router;
