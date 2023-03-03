const User = require("../models/User");
const UserVerification = require("../models/UserVerification");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthenticatedError,
  noContentError,
} = require("../errors");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

const register = async (req, res) => {
  const { email } = req.body;
  let user = await User.findOne({ email });
  if (user) {
    res.status(408).json({ message: "User with given email already Exist!" });
  }
  user = await User.create({ ...req.body });
  const verifyToken = await UserVerification.create({
    userId: user._id,
    token: crypto.randomBytes(32).toString("hex"),
  });
  const url = `${process.env.BASE_URL}/${user.id}/verify/${verifyToken.token}`;
  await sendEmail(user.email, "Verify Your Email", url);
  res.status(StatusCodes.CREATED).json({
    user: { firstName: user.firstName, verified: user.verified },
    message: "An Email sent to your account please verify",
  });
};

const verify = async (req, res) => {
  const id = req.params.id;
  const token = req.params.verifyToken;
  // console.log(token);
  // console.log(id);
  const user = await User.findOne({ _id: id });
  // console.log(user);
  if (!user) return res.status(400).send({ message: "Invalid link" });

  const verifyToken = await UserVerification.findOne({
    userId: id,
    token: req.params.verifyToken,
  });
  // console.log(verifyToken);
  if (!verifyToken) return res.status(400).send({ message: "Invalid link" });

  await User.updateOne({ _id: user._id, verified: true });
  await verifyToken.remove();

  res.status(200).send({ message: "Email verified successfully" });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("All fields are required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  if (!user.verified) {
    let verifyToken = await UserVerification.findOne({
      userId: user._id,
    });
    if (!verifyToken) {
      verifyToken = await UserVerification.create({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      });
      const url = `${process.env.BASE_URL}/api/v1/auth/${user.id}/verify/${verifyToken.token}`;
      await sendEmail(user.email, "Verify Your Email", url);
      res
        .status(400)

        .json({
          user: { firstName: user.firstName, verified: user.verified },
          message: "An Email sent to your account please verify",
        });
    }
  }
  // Saving refreshToken with current user
  const accessToken = user.createAccessJWT();
  const refreshToken = user.createRefreshJWT();

  await user.updateOne({
    refreshToken: refreshToken,
  });
  // Creates Secure Cookie with refresh token
  // Send access token to user

  res
    .status(StatusCodes.OK)
    .cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",

      maxAge: 24 * 60 * 60 * 1000,
    })
    .json({
      user: {
        firstName: user.firstName,
        email: user.email,
        verified: user.verified,
      },
      accessToken,
      message: "logged in successfully",
    });
};
const logout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    throw new noContentError("No Cookies provided ");
  }
  const refreshToken = cookies.jwt;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      sameSite: "None",

      maxAge: 24 * 60 * 60 * 1000,
    });
    throw new noContentError("	No Content ");
  }

  await user.updateOne({ refreshToken: " " });

  res.status(StatusCodes.NO_CONTENT).cookie("jwt", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
};
module.exports = {
  register,
  login,
  logout,
  verify,
};
