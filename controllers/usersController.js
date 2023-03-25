const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const User = require("../models/user");

const updateAvatar = async (req, res, next) => {
  try {
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
    await fs.unlink(req.file.path);
    next(error);
  }
};

module.exports = { updateAvatar };
