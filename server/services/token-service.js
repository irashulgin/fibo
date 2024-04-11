const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const tokenModel = require("../models/token-model");
const redis = require("redis");
const { promisify } = require("util");
//const redisClient = redis.createClient();

class TokenService {
  async generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "30m",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "30d",
    });

    const forgotPasswordToken = jwt.sign(
      payload,
      process.env.JWT_RESET_SECRET,
      {
        expiresIn: "1h",
      }
    );

    //   redis.set(user_id, JSON.stringify({
    //     accessToken,
    //     refreshToken,
    //     forgotPasswordToken,
    // }),
    //   redis.print
    // );

    return {
      accessToken,
      refreshToken,
      forgotPasswordToken,
    };
  }
  async removeToken(refreshToken) {
    const tokenData = await tokenModel.deleteOne({ refreshToken });
    return tokenData;
  }
  async saveToken(userId, refreshToken) {
    const tokenData = await tokenModel.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }

    const token = await tokenModel.create({ user: userId, refreshToken });
    console.log(token);
    return token;
  }

  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return userData;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return userData;
    } catch (e) {
      return null;
    }
  }
  validateResetToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_RESET_SECRET);
      return userData;
    } catch (e) {
      return null;
    }
  }

  async findToken(refreshToken) {
    const tokenData = await tokenModel.findOne({ refreshToken });
    return tokenData;
  }
}

module.exports = new TokenService();
