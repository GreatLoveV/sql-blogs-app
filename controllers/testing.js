const router = require("express").Router();
const Note = require("../models/blog");
const User = require("../models/user");

router.post("/reset", async (req, res) => {
  await Note.destroy({ where: {} });
  await User.destroy({ where: {} });

  res.status(204).end();
});

module.exports = router;
