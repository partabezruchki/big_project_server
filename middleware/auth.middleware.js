const BaseError = require("../errors/baseError");
const tokenService = require("../service/token.service");
const userModel = require("../models/user.model");
const UserDto = require("../dtos/user.dto");

const authMiddleware = async (req, res, next) => {
  try {
    // const { Refreshkuu } = req.cookies;
    // if (!Refreshkuu) {
    //   throw BaseError.UnauthorizedError();
    // }
    // const userData = tokenService.validataRefreshToken(Refreshkuu);
    // const tokenFromDb = await tokenService.findToken(Refreshkuu);
    // if (!tokenFromDb || !userData) {
    //   throw BaseError.UnauthorizedError();
    // }
    // const user = await userModel.findById(userData.id);
    // req.user = user || null;
    // next();
    const auth = req.headers.authorization;
    if (!auth) {
      return next(BaseError.UnauthorizedError());
    }
    const token = auth.split(" ")[1];
    if (!token) {
      return next(BaseError.UnauthorizedError());
    }
    const userData = tokenService.validataAccessToken(token);
    if (!userData) {
      return next(BaseError.UnauthorizedError());
    }
    // const tokenFromDb = await tokenService.findToken(token);
    // if (!tokenFromDb) {
    //   return next(BaseError.UnauthorizedError());
    // }
    // console.log("userData", userData);
    const user = await userModel.findById(userData.id);
    if (!user) {
      return next(BaseError.UnauthorizedError());
    }
    const userDto = new UserDto(user);
    req.user = userDto;
    return next();
  } catch (error) {
    return next(BaseError.UnauthorizedError());
  }
};

module.exports = authMiddleware;
