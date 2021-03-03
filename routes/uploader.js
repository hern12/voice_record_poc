var express = require("express");
var router = express.Router();
const multer = require("multer");
const upload = multer();
const fs = require("fs");
const path = require("path");
/* GET home page. */
router.post("/", upload.single("soundBlob"), function (req, res, next) {
  console.log(req.file); // see what got uploaded
  try {
    let uploadLocation = path.join(
      __dirname,
      "..",
      "/public/uploads/" + req.file.originalname
    );

    fs.writeFileSync(
      uploadLocation,
      Buffer.from(new Uint8Array(req.file.buffer))
    ); // write the blob to the server as a file
    res.sendStatus(200); //send back that everything went ok
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
