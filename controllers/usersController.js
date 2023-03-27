const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const User = require("../models/user");
const { RequestError } = require("../helpers");

const updateSubscription = async (req, res, next) => {
  try {
    const subscriptionType = ["starter", "pro", "business"];
    const { subscription: newSubscription } = req.body;
    const { _id, subscription } = req.user;
    if (!subscriptionType.includes(newSubscription)) {
      throw RequestError(400, "Invalid subscription type");
    }
    if (newSubscription === subscription) {
      throw RequestError(
        400,
        `Your subscription is already '${newSubscription}'`
      );
    }
    await User.findByIdAndUpdate(_id, {
      subscription: newSubscription,
    });
    res.json({
      message: `Your subscription has been changed to '${newSubscription}'`,
    });
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      console.log("this code");
      throw RequestError(400, "File is not selected");
    }
    const { _id } = req.user;
    const { path: tempDir, originalname } = req.file;
    const [extention] = originalname.split(".").reverse();
    const newFileName = `${_id}.${extention}`;
    const avatarsDir = path.join(__dirname, "../", "public", "avatars");
    const uploadDir = path.join(avatarsDir, newFileName);
    const img = await Jimp.read(tempDir);
    await img
      .cover(
        250,
        250,
        Jimp.HORIZONTAL_ALIGN_CENTER && Jimp.VERTICAL_ALIGN_MIDDLE
      )
      .write(tempDir);
    await fs.rename(tempDir, uploadDir);
    const avatarURL = path.join("avatars", newFileName);
    await User.findByIdAndUpdate(_id, { avatarURL });
    res.json({ avatarURL });
  } catch (error) {
    if (req.file) {
      await fs.unlink(req.file.path);
    }
    next(error);
  }
};

module.exports = { updateAvatar, updateSubscription };
