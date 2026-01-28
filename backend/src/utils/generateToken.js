const jwt = require("jsonwebtoken");

module.exports = (userId) => {
  return jwt.sign({ id: userId.toString() }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};