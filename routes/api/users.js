const express = require("express");
const usersController = require("../../controllers/usersController");
const { auth, upload } = require("../../middlewares");

const router = express.Router();

router.patch(
  "/avatars",
  auth,
  upload.single("avatar"),
  usersController.updateAvatar
);

module.exports = router;
