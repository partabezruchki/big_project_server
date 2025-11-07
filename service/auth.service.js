const userModel = require("../models/user.model");
const fileService = require("./file.service");
const bcrypt = require("bcrypt");
const UserDto = require("../dtos/user.dto");
const tokenService = require("./token.service");
const mailService = require("./mail.service");
const BaseError = require("../errors/baseError");
class AuthService {
  async register(data, image) {
    const { name, email, password } = data;
    const existUser = await userModel.findOne({ email: data.email });
    if (existUser) {
      throw BaseError.BadRequestError(
        `${existUser.email} nomli foydalanuvchi tizimda allaqachon mavjuud!`
      );
    }
    const fileName = fileService.userImage(image);
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      email,
      name,
      password: hashPassword,
      image: fileName,
    });

    const userDto = new UserDto(user);
    await mailService.sendMail(
      email,
      `${process.env.API_URL}/api/auth/activate/${userDto.id}`
    );

    const tokens = tokenService.generateToken({ id: userDto.id });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { user: userDto, ...tokens };
  }

  async activation(id) {
    const user = await userModel.findById(id);
    if (!user) {
      throw BaseError.BadRequestError("Foydalanuvchi topilmadi");
    }
    user.isActivated = true;
    await user.save();
    return user;
  }

  async login(data) {
    const { email, password } = data;
    const user = await userModel.findOne({ email });
    if (!user) {
      throw BaseError.BadRequestError("User not defined");
    }
    const comparePass = await bcrypt.compare(password, user.password);
    if (!comparePass) {
      throw BaseError.BadRequestError("Passord is incorrect ");
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ id: userDto.id });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { user: userDto, ...tokens };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(token) {
    if (!token) {
      throw BaseError.UnauthorizedError();
    }
    const userData = tokenService.validataRefreshToken(token);
    const tokenFromDb = await tokenService.findToken(token);
    if (!tokenFromDb || !userData) {
      throw BaseError.UnauthorizedError();
    }
    const user = await userModel.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ id: userData.id });
    await tokenService.saveToken(userData.id, tokens.refreshToken);
    return { user: userDto, ...tokens };
  }

  // async getMe(refreshToken) {
  //   const userData = tokenService.validataRefreshToken(refreshToken);
  //   const tokenFromDb = await tokenService.findToken(refreshToken);
  //   if (!tokenFromDb || !userData) {
  //     throw BaseError.UnauthorizedError();
  //   }
  //   const user = await userModel.findById(userData.id);
  //   const userDto = new UserDto(user);
  //   return userDto;
  // }
}

module.exports = new AuthService();
