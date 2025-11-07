const jwt = require("jsonwebtoken");
const tokenModel = require("../models/token.model");
class TokenService {
  generateToken(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY, {
      expiresIn: "30m",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY, {
      expiresIn: "30d",
    });
    return { accessToken, refreshToken };
  }

  async saveToken(userId, refreshToken) {
    const existToken = await tokenModel.findOne({ user: userId });
    if (existToken) {
      existToken.refreshToken = refreshToken;
      return existToken.save();
    }
    const token = await tokenModel.create({ user: userId, refreshToken });
    return token;
  }

  async removeToken(refreshToken) {
    return await tokenModel.findOneAndDelete({ refreshToken });
  }

  validataRefreshToken(refreshToken) {
    try {
      const userData = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);
      // console.log("userData", userData);
      return userData;
    } catch (error) {
      console.log("JWT verify error:", error.message);
      return null;
    }
  }
  validataAccessToken(accessToken) {
    try {
      const userData = jwt.verify(accessToken, process.env.JWT_ACCESS_KEY);
      // console.log("userData", userData);
      return userData;
    } catch (error) {
      console.log("JWT verify error:", error.message);
      return null;
    }
  }

  async findToken(refreshToken) {
    return await tokenModel.findOne({ refreshToken });
  }
}

module.exports = new TokenService();
