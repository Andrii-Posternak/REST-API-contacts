const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/user");
const { RequestError, sendEmail } = require("../helpers");
const { registerSchema, loginSchema } = require("../schemas/auth");
require("dotenv").config();

const { PORT, TOKEN_KEY } = process.env;

const register = async (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      throw RequestError(400, error.message);
    }
    const { email, password, subscription } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw RequestError(409, "Email in use");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = uuidv4();
    const user = await User.create({
      email,
      password: hashedPassword,
      subscription,
      avatarURL,
      verificationToken,
    });

    const msg = {
      to: email,
      subject: "Verify your email",
      text: "Follow the link to verify your email",
      html: `<a href="http://localhost:${PORT}/api/users/verify/:${verificationToken}" target="_blank">Verify</a>`,
    };
    await sendEmail(msg);

    res.status(201).json({
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      throw RequestError(400, error.message);
    }
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw RequestError(401, "Email or password is wrong");
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!existingUser.verify) {
      throw RequestError(401, "Email is not verified");
    }
    if (!isPasswordValid) {
      throw RequestError(401, "Email or password is wrong");
    }
    const payload = { id: existingUser._id };
    const token = jwt.sign(payload, TOKEN_KEY, { expiresIn: "1h" });
    await User.findByIdAndUpdate(existingUser._id, { token });
    res.json({
      token,
      user: {
        email: existingUser.email,
        subscription: existingUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const existingUser = await User.findById(_id);
    if (!existingUser) {
      throw RequestError(401, "Not authorized");
    }
    await User.findByIdAndUpdate(_id, { token: "" });
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, logout };
