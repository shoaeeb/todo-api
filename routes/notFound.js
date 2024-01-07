const express = require("express");
const path = require("path");
const notFoundFile = path.join(__dirname, "../public/NotFound.html");
const router = express.Router();
router.get("*", (req, res) => {
  res.status(404).sendFile(notFoundFile);
});

module.exports = router;
