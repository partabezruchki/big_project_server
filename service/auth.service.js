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

  async updateProfile(data, image, id) {
    const { name, email, phone, address } = data;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;

    // if (password) {
    //   updateData.password = await bcrypt.hash(password, 10);
    // }
    if (image) {
      const oldUser = await userModel.findById(id);
      if (!oldUser) throw BaseError.BadRequestError("User not found");

      if (oldUser.image) {
        const oldPath = path.join(
          __dirname,
          "..",
          "public/user",
          oldUser.image
        );
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      const fileName = fileService.userImage(image);
      updateData.image = fileName;
    }
    const user = await userModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) throw BaseError.BadRequestError("User not defined");

    return user;
  }

  async updatePassword(data, id) {
    const { oldPassword, newPassword } = data;

    const user = await userModel.findById(id);
    if (!user) throw BaseError.BadRequestError("User not defined");

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw BaseError.BadRequestError("Old password is incorrect");

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return { message: "Password updated successfully" };
  }

  async removeUser(id) {
    const user = await userModel.findById(id);
    if (!user) throw BaseError.BadRequestError("User not defined");

    if (user.image) {
      const filePath = path.join(__dirname, "..", "public/user", user.image);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await user.deleteOne();

    return { message: "User deleted successfully", user };
  }
}

module.exports = new AuthService();
