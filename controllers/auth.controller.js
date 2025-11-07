const authService = require("../service/auth.service");
const { validationResult } = require("express-validator");
const BaseError = require("../errors/baseError");
class AuthController {
  async register(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          BaseError.BadRequestError("Validation Error", errors.array())
        );
      }
      const data = req.body;
      let file;
      if (req.files) {
        file = req.files;
      }
      const resData = await authService.register(data, file?.image);
      res.cookie("Refreshkuu", resData.refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      res.send(resData);
    } catch (error) {
      next(error);
    }
  }

  async activation(req, res, next) {
    try {
      const userId = req.params.id;
      await authService.activation(userId);
      return res.redirect(process.env.FRONTEND_URL);
    } catch (error) {
      next(error);
    }
  }
  async login(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          BaseError.BadRequestError("Validation Error", errors.array())
        );
      }
      const data = req.body;
      const resData = await authService.login(data);
      res.cookie("Refreshkuu", resData.refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      res.send(resData);
    } catch (error) {
      next(error);
    }
  }
  async logout(req, res, next) {
    try {
      const { Refreshkuu } = req.cookies;
      await authService.logout(Refreshkuu);
      res.clearCookie("Refreshkuu");
      return res.status(200).json({ status: 200 });
    } catch (error) {
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      const { Refreshkuu } = req.cookies;
      const data = await authService.refresh(Refreshkuu);
      res.cookie("Refreshkuu", data.refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      res.send(data);
    } catch (error) {
      next(error);
    }
  }
  async getMe(req, res, next) {
    try {
      // const { Refreshkuu } = req.cookies;
      // const data = await authService.getMe(Refreshkuu);
      // res.send(data);
      res.send(req?.user);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
