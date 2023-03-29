const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const User = require("../models/user");
const { RequestError, sendEmail } = require("../helpers");
require("dotenv").config();

const { PORT } = process.env;

const getCurrentUser = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const existingUser = await User.findById(_id);
    if (!existingUser) {
      throw RequestError(401, "Not authorized");
    }
    res.json({
      email: existingUser.email,
      subscription: existingUser.subscription,
    });
  } catch (error) {
    next(error);
  }
};

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

const verification = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const existingUser = await User.findOne({ verificationToken });
    if (!existingUser) {
      throw RequestError(404, "User not found");
    }
    await User.findByIdAndUpdate(existingUser._id, {
      verificationToken: null,
      verify: true,
    });
    res.json({
      message: "Verification successful",
    });
  } catch (error) {
    next(error);
  }
};

const reVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw RequestError(400, "Missing required field email");
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw RequestError(404, "User not found");
    }
    if (existingUser.verify) {
      throw RequestError(400, "Verification has already been passed");
    }
    const msg = {
      to: email,
      subject: "Verify your email",
      html: `<p>This email has been resent because your account was not verified. Follow the <a href="http://localhost:${PORT}/api/users/verify/:${existingUser.verificationToken}" target="_blank">link</a> to verify your email</p>`,
    };
    await sendEmail(msg);
    res.json({
      message: "Verification email sent",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCurrentUser,
  updateAvatar,
  updateSubscription,
  verification,
  reVerification,
};
