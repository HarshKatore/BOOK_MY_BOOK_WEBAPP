const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "24h",
  });
};

exports.createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
    cookieOptions.sameSite = "none";
  }
  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;
  user.passwordChangedAt = undefined;

  res.status(statusCode).json({
    status: "success",
    user,
  });
};
